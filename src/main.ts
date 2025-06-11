import { SceneManager } from './SceneManager';

const canvas = document.querySelector("canvas");

if (canvas instanceof HTMLCanvasElement) {
    new SceneManager(canvas);
} else {
    console.error("Canvas element not found!");
}

// import { 
//     Engine, Color4, HemisphericLight, 
//     LoadAssetContainerAsync, Scene, 
//     Vector3, Quaternion,
//     QuarticEase,
//     ArcRotateCamera,
//     EasingFunction,
//     Animation,
//     SubMesh,
//     StandardMaterial,
//     Color3,
//     DynamicTexture,
//     Mesh,
//     VertexBuffer,
//     Texture,
//     Material,
// }
// from '@babylonjs/core';
// import "@babylonjs/loaders";
// import './style.css'

// export class BasicScene
// {
//     private canvas: HTMLCanvasElement;
//     scene: Scene;
//     engine: Engine;
//     private computerMeshes: any[] = [];
//     private minZoomDistance: number = 1.1;
//     private maxZoomDistance: number = 5;
//     private isAligned: boolean = true;
//     private currentYRotation: number = 0;
//     private isAnimating: boolean = false;
//     private lastAnimationTime: number = 0;
//     private lastStraighteningTime: number = 0;
//     private camera: ArcRotateCamera | null = null;

//     constructor(canvas: HTMLCanvasElement)
//     {
//         this.canvas = canvas;
//         this.engine = new Engine(this.canvas, true, { 
//             preserveDrawingBuffer: true, stencil: true });
//         this.scene = this.createScene();
//         this.scene.useRightHandedSystem = true;
//         this.createComputer();

//         this.engine.runRenderLoop(() => {
//             this.updateScene();
//             this.scene.render();
//         });

//         window.addEventListener('resize', () => {
//             this.engine.resize();
//         });

//         this.canvas.addEventListener('wheel', this.handleWheel.bind(this), {passive: false});
//     }

//     createScene():Scene
//     {
//         const scene = new Scene(this.engine);
//         scene.clearColor = new Color4(0, 0, 0, 0);
//         this.camera = new ArcRotateCamera("camera", Math.PI/2, Math.PI/2, this.maxZoomDistance, Vector3.Zero(), scene);
//         this.camera.inputs.clear();
//         this.camera.wheelPrecision = 100;
//         this.camera.lowerBetaLimit = Math.PI/2;
//         this.camera.upperBetaLimit = Math.PI/2;
//         this.camera.lowerRadiusLimit = this.minZoomDistance;
//         this.camera.upperRadiusLimit = this.maxZoomDistance;
//         this.camera.wheelDeltaPercentage = 0.05;
//         const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), scene);
//         hemiLight.intensity = 1.5;
//         return scene;
//     }
    
//     async createComputer(): Promise<void> 
//     {
//         try 
//         {
//             const container = await LoadAssetContainerAsync('./textures/scaled_retro.glb', this.scene);
//             container.addAllToScene();
//             this.computerMeshes = container.meshes;

//             this.computerMeshes.forEach((mesh) => {
//                 mesh.scaling = new Vector3(2, 2, 2);//.scaleInPlace(2);
//                 mesh.position = Vector3.Zero();
//                 mesh.rotationQuaternion = Quaternion.RotationYawPitchRoll(0, 0, 0);
//             });
            
//             const screen = this.computerMeshes.find(m => m.name === "ScreenMesh");
//             if (screen && screen.material)
//             {
//                 const screenTexture = new DynamicTexture('screenTexture', { width: 512, height: 512 }, this.scene, true);
//                 const screenMaterial = new StandardMaterial('screenMat', this.scene);
//                 screenMaterial.diffuseTexture = screenTexture;
//                 screenMaterial.emissiveColor = new Color3(0, 1, 0); // Screen glow
//                 screenMaterial.alpha = 1;
//                 screenMaterial.backFaceCulling = false;
//                 screenMaterial.useAlphaFromDiffuseTexture = true;
//                 screenMaterial.transparencyMode = Material.MATERIAL_ALPHABLEND;
//                 screen.material = screenMaterial
//                 const ctx = screenTexture.getContext() as CanvasRenderingContext2D;
//                 ctx.fillStyle = 'black';
//                 ctx.fillRect(0, 0, 512, 512);
//                 ctx.font = '20px monospace';
//                 ctx.fillStyle = '#00FF00'; // Retro green
//                 ctx.textAlign = 'left';
//                 ctx.textBaseline = 'top';        
                
//                 ctx.fillText('Welcome to Ngaurama-Linux 1.8 LTS', 20, 20);
//                 ctx.fillText('>> Type "help" to get started', 20, 50);
//                 ctx.fillText('evaluator@42: ~$', 20, 80);

//                 screenTexture.update();
//             }
//             if (this.camera)
//                 this.camera.setTarget(new Vector3(0, 0, 0));
//         }
//         catch (error) 
//         {
//             console.error('Failed to load model:', error);
//         }
//     }

//     private handleWheel(event: WheelEvent): void
//     {
//         event.preventDefault();

//         if (this.isAnimating || this.computerMeshes.length == 0 || !this.camera) return ;

//         const delta = (event.deltaY / 100) * 0.2;
//         const isZoomingOut = delta > 0;
//         if (isZoomingOut && this.camera.radius >= this.maxZoomDistance)
//             return;
//         const now = performance.now();
//         if (!this.isAligned && now - this.lastAnimationTime > 2000)
//         {
//             this.animateToStraight();
//         }
//         else if (this.isAligned)
//         {
//             const newRadius = Math.max(this.minZoomDistance, Math.min(this.maxZoomDistance, this.camera.radius + delta));
//             this.camera.radius = newRadius;
//         }
//     }

//     private animateToStraight():void
//     {
//         if (this.isAnimating) return;
//         this.isAnimating = true;

//         this.currentYRotation = ((this.currentYRotation + Math.PI) % (2 * Math.PI)) - Math.PI;

//         const animation = new Animation(
//             "rotateToStraight",
//             "rotationQuaternion",
//             60,
//             Animation.ANIMATIONTYPE_QUATERNION,
//             Animation.ANIMATIONLOOPMODE_CONSTANT
//         );

//         const keys = [
//             { frame:0, value: this.computerMeshes[0]?.
//             rotationQuaternion || Quaternion.Identity() },
//             {frame: 60, value: Quaternion.RotationYawPitchRoll(0, 0, 0)}
//         ];

//         animation.setKeys(keys);

//         const easingFunction = new QuarticEase();
//         easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
//         animation.setEasingFunction(easingFunction);

//         this.computerMeshes.forEach((mesh)=>{
//             if (mesh.rotationQuaternion)
//             {
//                 try{
//                     this.scene.beginDirectAnimation(
//                         mesh,
//                         [animation],
//                         0,
//                         60,
//                         false,
//                         1,
//                         () => {
//                             this.isAligned = true;
//                             this.currentYRotation = 0;
//                             this.isAnimating = false;
//                             this.lastAnimationTime = performance.now();
//                             this.lastStraighteningTime = performance.now();
//                         }
//                     );
//                 }
//                 catch(error)
//                 {
//                     console.error('Animation Failed', error);
//                     this.isAnimating = false;
//                 }
//             }
//         });
//     }

//     private updateScene(): void
//     {
//         if (this.computerMeshes.length == 0 || !this.camera) return;
        
//         this.camera.setTarget(Vector3.Zero());
        
//         const now = performance.now();
//         if (!this.isAnimating && this.camera && this.camera.radius == this.maxZoomDistance && now - this.lastStraighteningTime > 2000){
//                 this.isAligned = false;
//                 this.computerMeshes.forEach((mesh) => {
//                     if (mesh.rotationQuaternion){
//                         this.currentYRotation += 0.0015;
//                         mesh.rotationQuaternion = Quaternion.
//                         RotationYawPitchRoll(this.currentYRotation, 0, this.currentYRotation);
//                     }
//                 });
//             }
//     }
// }

// const canvas = document.querySelector("canvas");

// if (canvas instanceof HTMLCanvasElement)
//     new BasicScene(canvas);
// else
//     console.error("Canvas element not found!");
