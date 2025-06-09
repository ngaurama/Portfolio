import { Engine, FreeCamera, Color4, HemisphericLight, LoadAssetContainerAsync, MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from '@babylonjs/core';
import "@babylonjs/loaders";
import './style.css'

export class BasicScene
{
    private canvas: HTMLCanvasElement;
    scene: Scene;
    engine: Engine;

    constructor(canvas: HTMLCanvasElement)
    {
        this.canvas = canvas;
        this.engine = new Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
        this.scene = this.createScene();
        this.createComputer();

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }

    createScene():Scene
    {
        const scene = new Scene(this.engine);
        scene.clearColor = new Color4(0, 0, 0, 0);
        const camera = new FreeCamera("camera", new Vector3(0, 1, -5), this.scene);
        camera.attachControl(this.canvas, true);

        camera.speed = 0.5;
        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), this.scene);


        return scene;
    }

    async createComputer(): Promise<void> 
    {
        try 
        {
            const container = await LoadAssetContainerAsync('./textures/retro_computer.glb', this.scene);
            container.addAllToScene();
            container.meshes.forEach((mesh) => {
                mesh.scaling.scaleInPlace(2);
                mesh.position.x = 0;
                mesh.freezeWorldMatrix = (axis) => {
                    if (axis == Vector3.Right()){
                        mesh.position.x = 0;
                    }
                }
            });
        }
        catch (error) 
        {
            console.error('Failed to load model:', error);
        }
    }
}

const canvas = document.querySelector("canvas");

if (canvas instanceof HTMLCanvasElement)
    new BasicScene(canvas);
else
    console.error("Canvas element not found!");
