"use strict";

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
      // case 0:
      //   vertexId = "basicVertex";
      //   pixelId = "basicPixel";
      //   break;
      // case 1:
      //   vertexId = "bwVertex";
      //   pixelId = "bwPixel";
      //   break;
      // case 2:
      //   vertexId = "cellShadingVertex";
      //   pixelId = "cellShadingPixel";
      //   break;
      // case 3:
      //   vertexId = "phongVertex";
      //   pixelId = "phongPixel";
      //   break;
      // case 4:
      //   vertexId = "discardVertex";
      //   pixelId = "discardPixel";
      //   break;
      // case 5:
      //   vertexId = "waveVertex";
      //   pixelId = "phongPixel";
      //   break;
      // case 6:
      //   vertexId = "semVertex";
      //   pixelId = "semPixel";
      //   break;
      // case 7:
      //   vertexId = "fresnelVertex";
      //   pixelId = "fresnelPixel";
      //   break;
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

    var treeTexture = new BABYLON.Texture("TREE.tga", scene);

    shaderMaterial.setTexture("textureSampler", mainTexture);
    shaderMaterial.setTexture("refSampler", refTexture);
    shaderMaterial.setTexture("treeSampler", treeTexture);
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