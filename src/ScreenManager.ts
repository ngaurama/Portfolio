import { SceneManager } from './SceneManager';
import { Mesh, DynamicTexture, StandardMaterial, Color3, Material } from '@babylonjs/core';
import { FordJohnsonSorter } from './FordJohnson';


const sorter = new FordJohnsonSorter();
const result = sorter.sort([5, 3, 8, 1, 2]);
console.log('Sorted:', result);
console.log('Steps:', sorter.getSteps());

export class ScreenManager {
    private sceneManager: SceneManager;
    private screenMesh: Mesh;
    private screenTexture!: DynamicTexture;
    private screenMaterial!: StandardMaterial;
    private inputText: string = '';
    private cursorVisible: boolean = true;
    private lastCursorToggle: number = 0;
    private cursorBlinkInterval: number = 500;
    private commandHistory: string[] = [];
    private historyIndex: number = -1;
    private outputLines: string[] = [];
    private maxWidth: number = 472;
    private isInViewerMode: boolean = false;
    private viewerContentLines: string[] = [];
    private viewerScrollIndex: number = 0;
    private files: { [key: string]: string[] } = {
        '/': ['files', 'programs'],
        '/files': ['AboutMe.txt', 'Notes.txt', 'Bible.txt'],
        '/programs': ['fordjohnson']
    };
    private currentDirectory: string = '/';

    constructor(sceneManager: SceneManager, screenMesh: Mesh) {
        this.sceneManager = sceneManager;
        this.screenMesh = screenMesh;
        this.initializeInput();
    }

    initialize(): void {
        if (this.screenMesh.material) {
            this.screenTexture = new DynamicTexture('screenTexture', { width: 512, height: 512 }, this.sceneManager.scene, true);
            this.screenMaterial = new StandardMaterial('screenMat', this.sceneManager.scene);
            this.screenMaterial.diffuseTexture = this.screenTexture;
            this.screenMaterial.emissiveColor = new Color3(0, 1, 0);
            this.screenMaterial.alpha = 1;
            this.screenMaterial.backFaceCulling = false;
            this.screenMaterial.useAlphaFromDiffuseTexture = true;
            this.screenMaterial.transparencyMode = Material.MATERIAL_ALPHABLEND;
            this.screenMesh.material = this.screenMaterial;

            this.renderInitialContent();
        }
    }

    private initializeInput():void
    {
        window.addEventListener('keydown', (event) => {

            if (this.isInViewerMode) {
                if (event.key === 'ArrowDown') {
                    if (this.viewerScrollIndex < this.viewerContentLines.length - 1) {
                        this.viewerScrollIndex++;
                        this.renderViewer();
                    }
                } else if (event.key === 'ArrowUp') {
                    if (this.viewerScrollIndex > 0) {
                        this.viewerScrollIndex--;
                        this.renderViewer();
                    }
                } else if (event.key === 'q') {
                    this.isInViewerMode = false;
                    this.renderContent();
                }
                return;
            }
            if (event.key.length === 1 && this.inputText.length < 50)
                this.inputText += event.key;
            else if (event.key === 'Backspace' && this.inputText.length > 0)
                this.inputText = this.inputText.slice(0, -1);
            else if (event.key === 'Enter'){
                if (this.inputText)
                    this.commandHistory.unshift(this.inputText);
                this.historyIndex = -1;
                this.handleCommand(this.inputText);
                this.inputText = '';
            }
            else if (event.key === 'ArrowUp') {
                if (this.historyIndex + 1 < this.commandHistory.length) {
                    this.historyIndex++;
                    this.inputText = this.commandHistory[this.historyIndex];
                }
            } else if (event.key === 'ArrowDown') {
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.inputText = this.commandHistory[this.historyIndex];
                } else {
                    this.historyIndex = -1;
                    this.inputText = '';
                }
            } 
            this.renderContent();
        });
    }

    private handleCommand(command: string): void {
        let response = '';

        if (command === 'help') {
            response = 'Available commands: help, clear, cat, ls';
        } else if (command === 'clear') {
            this.outputLines = [];
            return this.renderContent();
        } else if (command === 'ls') {
            response = `Directory ${this.currentDirectory}: ${this.files[this.currentDirectory].join(', ')}`;
        } else if (command.toLowerCase().startsWith('cd')) {
            const parts = command.split(' ').filter(part => part.trim() !== '');
            if (parts.length === 2) {
                const dir = parts[1].toLowerCase();
                if (dir === '..' && this.currentDirectory !== '/') {
                    this.currentDirectory = '/';
                } else if (this.files[this.currentDirectory].includes(dir)) {
                    this.currentDirectory = `/${dir}`;
                } else {
                    response = `Directory '${dir}' not found.`;
                }
            } else {
                response = 'Usage: cd [dir] (e.g., cd files, cd ..)';
            }
        }
        else if (command.toLowerCase().startsWith('cat')) {
            const parts = command.split(' ').filter(part => part.trim() !== '');
            if (parts.length === 2) {
                const file = parts[1];
                if (this.files[this.currentDirectory].includes(file)) {
                    this.loadAndViewFile(`/src/files/${file}`);
                    return;
                } else {
                    response = `File '${file}' not found in ${this.currentDirectory}.`;
                }
            } else {
                response = 'Usage: cat [file]';
            }
        } else if (command.toLowerCase() === 'pwd') {
            response = `Current directory: ${this.currentDirectory}`;
        } else if (command.startsWith('./fordjohnson')) {
            if (this.currentDirectory !== '/programs') {
                response = `Error: Program ./fordjohnson not found in ${this.currentDirectory}.`;
            } else {
                const numbers = this.parseFordJohnsonCommand(command);
                if (numbers) {
                    const sorter = new FordJohnsonSorter();
                    const sorted = sorter.sort(numbers);
                    response = `Sorted: ${sorted.join(', ')}`;
                } else {
                    response = 'Invalid format. Use: ./fordjohnson [numbers]';
                }
            }
        } else if (!command)
            this.update();
        else {
            response = `Command '${command}' not recognized. Type 'help' for assistance.`;
        }

        this.outputLines.push(`evaluator@42: ~$ ${command}`);
        if (response) this.outputLines.push(response);
        this.updateResponse(response);
    }

    private async loadAndViewFile(filePath: string): Promise<void> {
        try {
            const response = await fetch(filePath);
            const content = await response.text();
            this.enterViewerMode(content);
        } catch (error) {
            this.enterViewerMode(`Error loading ${filePath}: ${error}`);
        }
    }

   private enterViewerMode(content: string): void {
        console.log('Entering viewer mode with content:', content);
        this.isInViewerMode = true;
        this.viewerScrollIndex = 0;
        this.viewerContentLines = content.split('\n').map(line => line.trim());
        this.renderViewer();
    }


    private renderViewer(): void {
        const ctx = this.screenTexture.getContext() as CanvasRenderingContext2D;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 512, 512);
        ctx.font = '16px monospace';
        ctx.fillStyle = '#00FF00';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        const visibleLines = this.viewerContentLines.slice(this.viewerScrollIndex, this.viewerScrollIndex + 15); // Show up to 15 lines
        let y = 20;
        for (const line of visibleLines) {
            const words = line.split(' ');
            let currentLine = '';
            for (const word of words) {
                const testLine = currentLine + (currentLine ? ' ' : '') + word;
                const width = ctx.measureText(testLine).width;
                if (width <= this.maxWidth) {
                    currentLine = testLine;
                } else {
                    ctx.fillText(currentLine, 20, y);
                    y += 20;
                    currentLine = word;
                }
            }
            if (currentLine) {
                ctx.fillText(currentLine, 20, y);
                y += 20;
            }
        }

        ctx.fillStyle = '#007700';
        ctx.fillText('     -- Arrow Keys to Navigate, Q to Exit --', 20, 480);
        this.screenTexture.update();
    }

    private parseFordJohnsonCommand(command: string): number[] | null {
        const parts = command.split(' ').filter(part => part !== './fordjohnson' && part.trim() !== '');
        const numbers = parts.map(part => parseInt(part)).filter(num => !isNaN(num));
        return numbers.length > 0 ? numbers : null;
    }

    private updateResponse(response: string): void{
        const ctx = this.screenTexture.getContext() as CanvasRenderingContext2D;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 512, 512);
        ctx.font = '20px monospace';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        ctx.fillText('Welcome to Ngaurama-Linux 1.8 LTS', 20, 20);
        ctx.fillText('>> Type "help" to get started', 20, 50);
        if (response) {
            ctx.fillStyle = '#FFFF00';
            ctx.fillText(response, 20, 100);
        }
        this.renderContent();
    }

    renderInitialContent(): void{
        const ctx = this.screenTexture.getContext() as CanvasRenderingContext2D;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 512, 512);
        ctx.font = '20px monospace';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        ctx.fillText('Welcome to Ngaurama-Linux 1.8 LTS', 20, 20);
        ctx.fillText('>> Type "help" to get started', 20, 50);
        ctx.fillText('evaluator@42: ~$ ', 20, 80);
        this.screenTexture.update();
    }

    renderContent(): void {
        const ctx = this.screenTexture.getContext() as CanvasRenderingContext2D;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 512, 512);
        ctx.font = '18px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        let y = 20;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('Welcome to Ngaurama-Linux 1.8 LTS', 20, y);
        y += 20;
        ctx.fillText('>> Type "help" to get started', 20, 50);
        y += 60;

        for (const line of this.outputLines.slice(-10)) {
            if (line.startsWith('evaluator@42')) {
                ctx.fillStyle = '#FFFFFF';
            } 
            else {
                ctx.fillStyle = '#FFFF00';
            }
            const words = line.split(' ');
            let currentLine = '';
            for (const word of words) {
                const testLine = currentLine + (currentLine ? ' ' : '') + word;
                const width = ctx.measureText(testLine).width;
                if (width <= this.maxWidth) {
                    currentLine = testLine;
                } else {
                    ctx.fillText(currentLine, 20, y);
                    y += 20;
                    currentLine = word;
                }
            }
            if (currentLine) {
                ctx.fillText(currentLine, 20, y);
                y += 20;
            }
        }

        const promptPrefix = `evaluator@42:${this.currentDirectory} ~$ `;
        ctx.fillStyle = '#00FF00';
        ctx.fillText(promptPrefix, 20, y);
        if (this.inputText) {
            ctx.fillStyle = '#FFFFFF';
            const words = this.inputText.split(' ');
            let currentLine = '';
            for (const word of words) {
                const testLine = currentLine + (currentLine ? ' ' : '') + word;
                const width = ctx.measureText(testLine).width;
                if (width <= this.maxWidth - ctx.measureText(promptPrefix).width) {
                    currentLine = testLine;
                } else {
                    ctx.fillText(currentLine, 20 + ctx.measureText(promptPrefix).width, y);
                    y += 20;
                    currentLine = word;
                }
            }
            if (currentLine) {
                ctx.fillText(currentLine, 20 + ctx.measureText(promptPrefix).width, y);
            }
        }

        if (this.cursorVisible && !this.isInViewerMode) {
            const cursorX = 20 + ctx.measureText(promptPrefix + this.inputText).width;
            ctx.fillStyle = '#00FFFF';
            ctx.fillText('┃', cursorX, y);
        }
        this.screenTexture.update();
    }
    
    update(): void {
        const now = performance.now();
        if (this.isInViewerMode)
        {
            this.renderViewer();
        }
        else
        {
            if (now - this.lastCursorToggle > this.cursorBlinkInterval) {
                this.cursorVisible = !this.cursorVisible;
                this.lastCursorToggle = now;
                this.renderContent();
            }
        }
    }
}
