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

        // Creates a UniversalCamera, and positions it
        var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 1.7, -5), scene);

        // Attaches the camera to the canvas
        camera.attachControl(canvas, true);

        // Set camera speed
        camera.speed = 0.2;

        // Enable collisions for the camera
        camera.checkCollisions = true;
        camera.applyGravity = true;

        // Set the camera to be contained within the cabin
        camera.ellipsoid = new BABYLON.Vector3(1, 0.8, 1);

        // Creates a light, aiming 0,1,0 - to the sky
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

        // Dim the light a small amount
        light.intensity = 0.5;

        // Create a point light for the fireplace
        var fireLight = new BABYLON.PointLight("fireLight", new BABYLON.Vector3(0, 1, cabinDepth / 2 - 0.5), scene);
        fireLight.diffuse = new BABYLON.Color3(1, 0.5, 0); // Warm color
        fireLight.intensity = 1;

        // Enable gravity
        scene.gravity = new BABYLON.Vector3(0, -0.9, 0);

        // Creates a ground plane
        var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 30, height: 30}, scene);
        ground.checkCollisions = true;

        // Cabin dimensions
        var cabinWidth = 10;
        var cabinDepth = 15;
        var cabinHeight = 4;
        var wallThickness = 0.2;

        // Create floor
        var floor = BABYLON.MeshBuilder.CreateBox("floor", {width: cabinWidth, depth: cabinDepth, height: wallThickness}, scene);
        floor.position.y = wallThickness / 2;
        floor.checkCollisions = true;

        // Create floor material
        var floorMaterial = new BABYLON.StandardMaterial("floorMaterial", scene);
        floorMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.2, 0); // Brown
        floor.material = floorMaterial;

        // Create walls
        var wall1 = BABYLON.MeshBuilder.CreateBox("wall1", {width: cabinWidth, height: cabinHeight, depth: wallThickness}, scene);
        wall1.position.z = cabinDepth / 2;
        wall1.position.y = cabinHeight / 2;
        wall1.checkCollisions = true;

        var wall2 = BABYLON.MeshBuilder.CreateBox("wall2", {width: cabinWidth, height: cabinHeight, depth: wallThickness}, scene);
        wall2.position.z = -cabinDepth / 2;
        wall2.position.y = cabinHeight / 2;
        wall2.checkCollisions = true;

        var wall3 = BABYLON.MeshBuilder.CreateBox("wall3", {width: wallThickness, height: cabinHeight, depth: cabinDepth}, scene);
        wall3.position.x = cabinWidth / 2;
        wall3.position.y = cabinHeight / 2;
        wall3.checkCollisions = true;

        var wall4 = BABYLON.MeshBuilder.CreateBox("wall4", {width: wallThickness, height: cabinHeight, depth: cabinDepth}, scene);
        wall4.position.x = -cabinWidth / 2;
        wall4.position.y = cabinHeight / 2;
        wall4.checkCollisions = true;

        // Create wall material
        var wallMaterial = new BABYLON.StandardMaterial("wallMaterial", scene);
        wallMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.6, 0.4); // Light Brown

        wall1.material = wallMaterial;
        wall2.material = wallMaterial;
        wall3.material = wallMaterial;
        wall4.material = wallMaterial;

        // Create ceiling
        var ceiling = BABYLON.MeshBuilder.CreateBox("ceiling", {width: cabinWidth, depth: cabinDepth, height: wallThickness}, scene);
        ceiling.position.y = cabinHeight;
        ceiling.material = floorMaterial;
        ceiling.checkCollisions = true;

        // Create loft
        var loft = BABYLON.MeshBuilder.CreateBox("loft", {width: cabinWidth, height: wallThickness, depth: cabinDepth / 2}, scene);
        loft.position.y = cabinHeight / 1.5;
        loft.position.z = -cabinDepth / 4;
        loft.material = floorMaterial;
        loft.checkCollisions = true;

        // Create desk
        var desk = BABYLON.MeshBuilder.CreateBox("desk", {width: 2, height: 1, depth: 1}, scene);
        desk.position.x = -cabinWidth / 2 + 1.5;
        desk.position.y = 0.5;
        desk.position.z = 0;
        desk.checkCollisions = true;

        // Create bookcase
        var bookcase = BABYLON.MeshBuilder.CreateBox("bookcase", {width: 1.5, height: 2.5, depth: 0.5}, scene);
        bookcase.position.x = cabinWidth / 2 - 1;
        bookcase.position.y = 1.25;
        bookcase.position.z = 4;
        bookcase.checkCollisions = true;

        // Create Fireplace
        var fireplace = BABYLON.MeshBuilder.CreateBox("fireplace", {width: 3, height: 2, depth: 0.5}, scene);
        fireplace.position.z = cabinDepth / 2 - 0.25;
        fireplace.position.y = 1;
        fireplace.checkCollisions = true;

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