﻿"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", start, false);

  var engine;
  var meshes = [];
  var scene;
  var shaderMaterial;
  var vertexEditor;
  var pixelEditor;

  function selectTemplate() {
    var select = document.getElementById("templates");
    var vertexId;
    var pixelId;

    switch (select.value) {
      case "noLight": {
        vertexId = "basicLight_noLight_vret";
        pixelId = "basicLight_noLight_frag";
        break;
      }
      case "flat": {
        vertexId = "basicLight_flat_vret";
        pixelId = "basicLight_flat_frag";
        break;
      }
      case "simplestLight": {
        vertexId = "basicLight_simplestList_vret";
        pixelId = "basicLight_simplestList_frag";
        break;
      }
      case "perVertexLighting": {
        vertexId = "basicLight_perVertexLighting_vret";
        pixelId = "basicLight_perVertexLighting_frag";
        break;
      }
      case "perPixelLighting": {
        vertexId = "basicLight_perPixelLighting_vret";
        pixelId = "basicLight_perPixelLighting_frag";
        break;
      }
      case "pointLight": {
        vertexId = "basicLight_pointLight_vret";
        pixelId = "basicLight_pointLight_frag";
        break;
      }
      case "spotLight": {
        vertexId = "basicLight_spotLight_vret";
        pixelId = "basicLight_spotLight_frag";
        break;
      }
      case "basicTexture": {
        vertexId = "basicLight_basicTexture_vret";
        pixelId = "basicLight_basicTexture_frag";
        break;
      }

      case "tone": {
        vertexId = "npr_tone_vert";
        pixelId = "npr_tone_frag";
        break;
      }
      case "hatch": {
        vertexId = "npr_hatch_vert";
        pixelId = "npr_hatch_frag";
        break;
      }
      case "gooch": {
        vertexId = "npr_gooch_vert";
        pixelId = "npr_gooch_frag";
        break;
      }
      case "PolkaDot": {
        vertexId = "npr_PolkaDot_vert";
        pixelId = "npr_PolkaDot_frag";
        break;
      }
      case "sphereTransform": {
        vertexId = "transform_sphereTransform_vert";
        pixelId = "transform_sphereTransform_frag";
        break;
      }
      case "simpleNoise": {
        vertexId = "noise_simpleNoise_vert";
        pixelId = "noise_simpleNoise_frag";
        break;
      }
      case "PerlinNoise": {
        vertexId = "noise_PerlinNoise_vert";
        pixelId = "noise_PerlinNoise_frag";
        break;
      }
      case "stripe": {
        vertexId = "processing_stripe_vret";
        pixelId = "processing_stripe_frag";
        break;
      }
      case "bric": {
        vertexId = "processing_bric_vret";
        pixelId = "processing_bric_frag";
        break;
      }
      case "chessboard": {
        vertexId = "processing_chessboard_vret";
        pixelId = "processing_chessboard_frag";
        break;
      }
      case "grid": {
        vertexId = "processing_grid_vret";
        pixelId = "processing_grid_frag";
        break;
      }
      case "brightness": {
        vertexId = "postEffect_vret";
        pixelId = "postEffect_brightness_frag";
        break;
      }
      case "contrast": {
        vertexId = "postEffect_vret";
        pixelId = "postEffect_contrast_frag";
        break;
      }
      case "saturation": {
        vertexId = "postEffect_vret";
        pixelId = "postEffect_saturation_frag";
        break;
      }
      case "RGB2CMY": {
        vertexId = "postEffect_vret";
        pixelId = "postEffect_RGB2CMY_frag";
        break;
      }
      case "RGB2CIE": {
        vertexId = "postEffect_vret";
        pixelId = "postEffect_RGB2CIE_frag";
        break;
      }
      case "picMix": {
        vertexId = "postEffect_vret";
        pixelId = "postEffect_picMix_frag";
        break;
      }
      case "SmoothingNeighbour": {
        vertexId = "postEffect_vret";
        pixelId = "postEffect_SmoothingNeighbour_frag";
        break;
      }
      case "Gauss": {
        vertexId = "postEffect_vret";
        pixelId = "postEffect_Gauss_frag";
        break;
      }
      case "Laplace": {
        vertexId = "postEffect_vret";
        pixelId = "postEffect_Laplace_frag";
        break;
      }
      case "pencil": {
        vertexId = "postEffect_vret";
        pixelId = "postEffect_pencil_frag";
        break;
      }
      case "relief": {
        vertexId = "postEffect_vret";
        pixelId = "postEffect_relief_frag";
        break;
      }
      case "Mosaic": {
        vertexId = "postEffect_vret";
        pixelId = "postEffect_Mosaic_frag";
        break;
      }
      case "Mosaic_Point": {
        vertexId = "postEffect_vret";
        pixelId = "postEffect_Mosaic_Point_frag";
        break;
      }
      default:
        return;
    }

    //location.hash = undefined;

    vertexEditor.setValue(BABYLON.Tools.GetDOMTextContent(document.getElementById(vertexId)).trim());
    vertexEditor.gotoLine(0);
    pixelEditor.setValue(BABYLON.Tools.GetDOMTextContent(document.getElementById(pixelId)).trim());
    pixelEditor.gotoLine(0);

    compile();
  }

  function selectMesh() {
    var select = document.getElementById("meshes");

    for (var index = 0; index < meshes.length; index++) {
      var mesh = meshes[index];
      mesh.dispose();
    }
    meshes = [];

    switch (select.selectedIndex) {
      case 0:
        // Creating sphere
        meshes.push(BABYLON.Mesh.CreateSphere("mesh", 16, 5, scene));
        break;
      case 1:
        // Creating Torus
        meshes.push(BABYLON.Mesh.CreateTorus("mesh", 5, 1, 32, scene));
        break;
      case 2:
        // Creating Box
        meshes.push(BABYLON.Mesh.CreateBox("mesh", 5, scene));
        break;
      case 3:
        // Creating Torus knot
        meshes.push(BABYLON.Mesh.CreateTorusKnot("mesh", 2, 0.5, 128, 64, 2, 3, scene));
        break;
      case 4:
        // Creating Ground
        meshes.push(BABYLON.Mesh.CreateGroundFromHeightMap("mesh", "heightMap.png", 8, 8, 100, 0, 3, scene, false));
        break;
      case 5:
        // Creating Schooner
        document.getElementById("loading").className = "";
        BABYLON.SceneLoader.ImportMesh("", "", "schooner.babylon", scene, function (newMeshes) {
          for (index = 0; index < newMeshes.length; index++) {
            mesh = newMeshes[index];
            mesh.material = shaderMaterial;
            meshes.push(mesh);
          }

          document.getElementById("loading").className = "hidden";
        });
        break;
        // Creating Tree
      case 6:
        document.getElementById("loading").className = "";
        BABYLON.SceneLoader.ImportMesh("", "", "tree.babylon", scene, function (newMeshes) {
          for (index = 0; index < newMeshes.length; index++) {
            mesh = newMeshes[index];
            mesh.material = shaderMaterial;
            meshes.push(mesh);
          }

          document.getElementById("loading").className = "hidden";
        });
        break;
      case 7:
        document.getElementById("loading").className = "";
        BABYLON.SceneLoader.ImportMesh("", "", "teapot.babylon", scene, function (newMeshes) {
          for (index = 0; index < newMeshes.length; index++) {
            mesh = newMeshes[index];
            mesh.material = shaderMaterial;
            meshes.push(mesh);
          }

          document.getElementById("loading").className = "hidden";
        });
        break;
      case 8:
        document.getElementById("loading").className = "";
        BABYLON.SceneLoader.ImportMesh("", "", "monkey.babylon", scene, function (newMeshes) {
          for (index = 0; index < newMeshes.length; index++) {
            mesh = newMeshes[index];
            mesh.material = shaderMaterial;
            meshes.push(mesh);
          }

          document.getElementById("loading").className = "hidden";
        });
        break;
      case 9:
        // Creating plane
        var plane = BABYLON.Mesh.CreatePlane("mesh", 8, scene);
        plane.rotation.y = Math.PI/2;
        meshes.push(plane);
        break;
        return;
    }


    for (index = 0; index < meshes.length; index++) {
      mesh = meshes[index];
      mesh.material = shaderMaterial;
    }
  }


  function start() {
    effectiveStart();
  }

  function effectiveStart() {
    // Editors
    vertexEditor = ace.edit("vertexShaderEditor");
    vertexEditor.setTheme("ace/theme/chrome");
    vertexEditor.getSession().setMode("ace/mode/glsl");
    vertexEditor.setShowPrintMargin(false);

    pixelEditor = ace.edit("fragmentShaderEditor");
    pixelEditor.setTheme("ace/theme/chrome");
    pixelEditor.getSession().setMode("ace/mode/glsl");
    pixelEditor.setShowPrintMargin(false);

    // UI
    document.getElementById("templates").addEventListener("change", selectTemplate, false);
    document.getElementById("meshes").addEventListener("change", selectMesh, false);
    document.getElementById("compileButton").addEventListener("click", compile, false);

    // Babylon.js
    if (BABYLON.Engine.isSupported()) {
      var canvas = document.getElementById("renderCanvas");
      engine = new BABYLON.Engine(canvas, true);
      scene = new BABYLON.Scene(engine);
      var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 2, 12, BABYLON.Vector3.Zero(), scene);

      camera.attachControl(canvas, false);
      camera.lowerRadiusLimit = 1;
      camera.minZ = 1.0;

      selectMesh();

      if (!location.hash) {
        selectTemplate(true);
      }

      var time = 0;
      engine.runRenderLoop(function () {
        if (shaderMaterial) {
          shaderMaterial.setFloat("time", time);
          time += 0.02;

          shaderMaterial.setVector3("cameraPosition", camera.position);
        }

        scene.render();
      });

      window.addEventListener("resize", function () {
        engine.resize();
      });
    }
  }

  function compile() {
    // Exceptionally we do not want cache
    if (shaderMaterial) {
      shaderMaterial.dispose(true);
    }

    // Getting data from editors
    document.getElementById("vertexShaderCode").innerHTML = vertexEditor.getValue();
    document.getElementById("fragmentShaderCode").innerHTML = pixelEditor.getValue();

    shaderMaterial = new BABYLON.ShaderMaterial("shader", scene, {
        vertexElement: "vertexShaderCode",
        fragmentElement: "fragmentShaderCode"
      },
      {
        attributes: ["position", "normal", "uv"],
        uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
      });

    var refTexture = new BABYLON.Texture("ref.jpg", scene);
    refTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
    refTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;

    var mainTexture = new BABYLON.Texture("amiga.jpg", scene);

    var treeTexture = new BABYLON.Texture("Tree.tga", scene);

    var lenaTexture = new BABYLON.Texture("lena.jpg", scene);

    shaderMaterial.setTexture("textureSampler", mainTexture);
    shaderMaterial.setTexture("refSampler", refTexture);
    shaderMaterial.setTexture("treeSampler", treeTexture);
    shaderMaterial.setTexture("picSampler", lenaTexture);
    shaderMaterial.setFloat("time", 0);
    shaderMaterial.setVector3("cameraPosition", BABYLON.Vector3.Zero());
    shaderMaterial.backFaceCulling = false;

    for (var index = 0; index < meshes.length; index++) {
      var mesh = meshes[index];
      mesh.material = shaderMaterial;
    }

    shaderMaterial.onCompiled = function () {
      document.getElementById("errorLog").innerHTML = "<span>" + new Date().toLocaleTimeString() + ": Shaders compiled successfully</span><BR>" + document.getElementById("errorLog").innerHTML;
      document.getElementById("shadersContainer").style.backgroundColor = "green";
    };
    shaderMaterial.onError = function (sender, errors) {
      document.getElementById("errorLog").innerHTML = "<span class=error>" + new Date().toLocaleTimeString() + ": " + errors + "</span><BR>" + document.getElementById("errorLog").innerHTML;
      document.getElementById("shadersContainer").style.backgroundColor = "red";
    };
  }
})();