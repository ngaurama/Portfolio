import type { Engine } from "@babylonjs/core";

export class CustomLoadingScreen {
    private engine: Engine;
    private progress: number = 0;

    loadingUIBackgroundColor: string = "#000000";
    loadingUIText: string = "Loading...";

    constructor(engine: Engine) {
        this.engine = engine;
    }

    displayLoadingUI() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
            this.updateProgress(0);
        }
    }

    hideLoadingUI() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }

    updateProgress(progress: number) {
        this.progress = progress;
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${Math.min(100, progress)}%`;
        }
    }
}