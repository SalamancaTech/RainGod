// Game logic will go here
window.addEventListener('DOMContentLoaded', function(){
    // get the canvas DOM element
    var canvas = document.getElementById('renderCanvas');

    // load the 3D engine
    var engine = new BABYLON.Engine(canvas, true);

    var gamePaused = false;

    // createScene function that creates and return the scene
    var createScene = function(){
        // create a basic BJS Scene object
        var scene = new BABYLON.Scene(engine);

        // Creates a default arc rotate camera and attaches it to the canvas
        var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 4, 10, new BABYLON.Vector3(0, 0, 0), scene);
        camera.attachControl(canvas, true);

        // Create a directional light
        var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
        light.position = new BABYLON.Vector3(20, 40, 20);

        // create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
        var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);

        // move the sphere upward 1/2 of its height
        sphere.position.y = 1;

        // Lock the camera's target to the sphere
        camera.lockedTarget = sphere;

        // create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
        var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);
        ground.receiveShadows = true;

        // Shadows
        var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        shadowGenerator.getShadowMap().renderList.push(sphere);

        // Keyboard events
        var inputMap = {};
        scene.actionManager = new BABYLON.ActionManager(scene);
        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
            inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));
        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
            inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));

        var advancedTexture;
        var pauseMenu, weatherMenu;

        function createPauseMenu() {
            advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

            pauseMenu = new BABYLON.GUI.StackPanel();
            pauseMenu.width = "200px";
            pauseMenu.isVertical = true;
            pauseMenu.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            pauseMenu.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            advancedTexture.addControl(pauseMenu);

            var resumeButton = BABYLON.GUI.Button.CreateSimpleButton("resume", "Resume");
            resumeButton.width = "100%";
            resumeButton.height = "40px";
            resumeButton.color = "white";
            resumeButton.background = "green";
            resumeButton.onPointerUpObservable.add(function () {
                gamePaused = false;
                pauseMenu.isVisible = false;
            });
            pauseMenu.addControl(resumeButton);

            var weatherButton = BABYLON.GUI.Button.CreateSimpleButton("weather", "Weather Effects");
            weatherButton.width = "100%";
            weatherButton.height = "40px";
            weatherButton.color = "white";
            weatherButton.background = "green";
            weatherButton.onPointerUpObservable.add(function () {
                pauseMenu.isVisible = false;
                weatherMenu.isVisible = true;
            });
            pauseMenu.addControl(weatherButton);

            pauseMenu.isVisible = false;
        }

        function createWeatherMenu() {
            weatherMenu = new BABYLON.GUI.StackPanel();
            weatherMenu.width = "200px";
            weatherMenu.isVertical = true;
            weatherMenu.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            weatherMenu.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            advancedTexture.addControl(weatherMenu);

            var rainButton = BABYLON.GUI.Button.CreateSimpleButton("rain", "Toggle Rain");
            rainButton.width = "100%";
            rainButton.height = "40px";
            rainButton.color = "white";
            rainButton.background = "green";
            rainButton.onPointerUpObservable.add(function () {
                if (rain.isStarted()) {
                    rain.stop();
                } else {
                    rain.start();
                }
            });
            weatherMenu.addControl(rainButton);

            var backButton = BABYLON.GUI.Button.CreateSimpleButton("back", "Back");
            backButton.width = "100%";
            backButton.height = "40px";
            backButton.color = "white";
            backButton.background = "green";
            backButton.onPointerUpObservable.add(function () {
                weatherMenu.isVisible = false;
                pauseMenu.isVisible = true;
            });
            weatherMenu.addControl(backButton);

            weatherMenu.isVisible = false;
        }

        window.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                gamePaused = !gamePaused;
                if (gamePaused) {
                    if (!advancedTexture) {
                        createPauseMenu();
                        createWeatherMenu();
                    }
                    pauseMenu.isVisible = true;
                } else {
                    if (pauseMenu) {
                        pauseMenu.isVisible = false;
                    }
                    if (weatherMenu) {
                        weatherMenu.isVisible = false;
                    }
                }
            }
        });

        // Rain particle system
        var rain = new BABYLON.ParticleSystem("particles", 2000, scene);
        rain.particleTexture = new BABYLON.Texture("https://www.babylonjs.com/assets/Flare.png", scene);
        rain.emitter = new BABYLON.Vector3(0, 30, 0);
        rain.minEmitBox = new BABYLON.Vector3(-10, 0, -10);
        rain.maxEmitBox = new BABYLON.Vector3(10, 0, 10);
        rain.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
        rain.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
        rain.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
        rain.minSize = 0.1;
        rain.maxSize = 0.2;
        rain.minLifeTime = 0.3;
        rain.maxLifeTime = 1.5;
        rain.emitRate = 1500;
        rain.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        rain.gravity = new BABYLON.Vector3(0, -9.81, 0);
        rain.direction1 = new BABYLON.Vector3(-7, -8, 3);
        rain.direction2 = new BABYLON.Vector3(7, -8, -3);
        rain.minAngularSpeed = 0;
        rain.maxAngularSpeed = Math.PI;
        rain.minEmitPower = 1;
        rain.maxEmitPower = 3;
        rain.updateSpeed = 0.005;
        rain.start();

        // Game/Render loop
        scene.onBeforeRenderObservable.add(() => {
            if (gamePaused) {
                return;
            }
            var forward = camera.getDirection(BABYLON.Axis.Z);
            var right = camera.getDirection(BABYLON.Axis.X);
            var moveDirection = new BABYLON.Vector3(0, 0, 0);

            if (inputMap["w"] || inputMap["ArrowUp"]) {
                moveDirection.addInPlace(forward);
            }
            if (inputMap["s"] || inputMap["ArrowDown"]) {
                moveDirection.subtractInPlace(forward);
            }
            if (inputMap["a"] || inputMap["ArrowLeft"]) {
                moveDirection.subtractInPlace(right);
            }
            if (inputMap["d"] || inputMap["ArrowRight"]) {
                moveDirection.addInPlace(right);
            }

            if (moveDirection.length() > 0.01) {
                moveDirection.y = 0; // Project to XZ plane
                moveDirection.normalize();
                sphere.position.addInPlace(moveDirection.scale(0.1));
            }
        });

        // return the created scene
        return scene;
    }

    // call the createScene function
    var scene = createScene();

    // run the render loop
    engine.runRenderLoop(function(){
        scene.render();
    });

    // the canvas/window resize event handler
    window.addEventListener('resize', function(){
        engine.resize();
    });
});