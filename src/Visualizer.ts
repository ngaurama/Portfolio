import { SceneManager } from './SceneManager';
import { Mesh, Vector3, StandardMaterial, Color3, MeshBuilder } from '@babylonjs/core';
import { FordJohnsonSorter, type VisualStep } from './FordJohnson';

export class Visualizer {
    private sceneManager: SceneManager;
    private blocks: Mesh[] = [];
    public isVisualizing: boolean = false;
    private steps: VisualStep[] = [];
    private stepIndex: number = 0;
    private animationFrame: number = 0;

    constructor(sceneManager: SceneManager) {
        this.sceneManager = sceneManager;
    }

    initialize(numbers: number[]): void {
        this.isVisualizing = true;
        const sorter = new FordJohnsonSorter();
        sorter.sort([...numbers]);
        this.steps = sorter.getSteps();
        this.stepIndex = 0;
        this.animationFrame = requestAnimationFrame(() => this.animateSteps());

        // Clear previous blocks
        this.blocks.forEach(b => b.dispose());
        this.blocks = [];

        // Create blocks
        const baseSize = 1;
        const spacing = 2;
        numbers.forEach((num, index) => {
            const block = MeshBuilder.CreateBox(`block_${index}`, { size: baseSize }, this.sceneManager.scene);
            block.scaling = new Vector3(baseSize, num, baseSize);
            block.position = new Vector3(index * spacing - (numbers.length - 1) * spacing / 2, num / 2, 0);
            block.material = new StandardMaterial(`blockMat_${index}`, this.sceneManager.scene);
            (block.material as StandardMaterial).diffuseColor = new Color3(0, 1, 0); // Green
            this.blocks.push(block);
        });

        // Adjust camera
        if (this.sceneManager.camera) {
            this.sceneManager.camera.radius = 5; // Closer zoom
            this.sceneManager.camera.setTarget(new Vector3(0, Math.max(...numbers) / 2, 0));
            this.sceneManager.camera.lowerRadiusLimit = 2;
            this.sceneManager.camera.upperRadiusLimit = 10;
        }
    }

    animateSteps(): void {
        if (!this.isVisualizing || this.stepIndex >= this.steps.length) return;

        const step = this.steps[this.stepIndex];
        if (step.type === 'compare') {
            const [val1, val2] = step.values;
            const [idx1, idx2] = step.indices as [number, number];
            if (idx1 !== null && idx2 !== null && idx1 < this.blocks.length && idx2 < this.blocks.length) {
                this.blocks[idx1].material = new StandardMaterial(`blockMat_${idx1}`, this.sceneManager.scene);
                (this.blocks[idx1].material as StandardMaterial).diffuseColor = new Color3(1, 0, 0); // Red
                this.blocks[idx2].material = new StandardMaterial(`blockMat_${idx2}`, this.sceneManager.scene);
                (this.blocks[idx2].material as StandardMaterial).diffuseColor = new Color3(1, 0, 0); // Red
            }
        } else if (step.type === 'insert' || step.type === 'swap') {
            // Update positions or colors for insert/swap (simplified)
            this.blocks.forEach(b => {
                b.material = new StandardMaterial(`blockMat_${this.blocks.indexOf(b)}`, this.sceneManager.scene);
                (b.material as StandardMaterial).diffuseColor = new Color3(0, 1, 0); // Reset to green
            });
        }

        this.stepIndex++;
        this.animationFrame = requestAnimationFrame(() => this.animateSteps());
    }

    exitVisualization(): void {
        this.isVisualizing = false;
        cancelAnimationFrame(this.animationFrame);
        this.blocks.forEach(b => b.dispose());
        this.blocks = [];
        if (this.sceneManager.camera) {
            this.sceneManager.camera.radius = 5;
            this.sceneManager.camera.setTarget(new Vector3(0, 0, 0));
            this.sceneManager.camera.lowerRadiusLimit = this.sceneManager.minZoomDistance;
            this.sceneManager.camera.upperRadiusLimit = this.sceneManager.maxZoomDistance;
        }
        this.sceneManager.updateScene(); 
    }
}
