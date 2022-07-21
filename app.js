(function () {
  var socket = document.createElement('script')
  var script = document.createElement('script')
  socket.setAttribute('src', 'http://127.0.0.1:1337/socket.io/socket.io.js')
  script.type = 'text/javascript'

  socket.onload = function () {
    document.head.appendChild(script)
  }
  script.text = ['window.socket = io("http://127.0.0.1:1337");',
  'socket.on("bundle", function() {',
  'console.log("livereaload triggered")',
  'window.location.reload();});'].join('\n')
  document.head.appendChild(socket)
}());
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const setup = require('./setup-v3');
const { options, createObjects,  } = require('./objects');
const texts = require('./texts');
const {
    checkArea,
} = require("./functions");
//const {intro} = require('./intro');
//const {footer} = require('./footer');


//MAIN
(function main() {
    setup(options, (app, resources) => {
        /* MAIN TIMELINE */
        const mainTimeline = () => {
            const timeline = gsap.timeline();
            // timeline.add(intro(app, resources));
            timeline.add(footer(app, resources, texts));
            timeline.add(initialPosition());
            timeline.add(moveMaterialsToTable());
            

            return timeline;
        };

        /* CREATE ITEMS SCOPE */
        const allObjects = createObjects(app, resources);

         //criando constantes dos Objetos
        const {
            table,
            hitAreaBicodeBunsen,
            objctsmaterials,
            hitAreaMesa,
    
        } = allObjects;
        
        function moveMaterialsToTable(){
            objctsmaterials.forEach((material) => {
                material.interactive = true;
                material.buttonMode = true;
                material
                  .on("pointerdown", onMaterialStart)
                  .on("pointerup", () => onMaterialEnd(material))
                  .on("pointerupoutside", () => onMaterialEnd(material))
                  .on("pointermove", onMaterialMove);
              });
        }
        function onMaterialStart(event) {
            this.data = event.data;
            this.dragging = true;
        }
        function onMaterialMove() {
            if (this.dragging) {
              const newPosition = this.data.getLocalPosition(this.parent);
              this.x = newPosition.x;
              this.y = newPosition.y;
            }
        }
        function onMaterialEnd(material) {
            const moveScale = gsap.timeline({
              delay: 0.1,
            });
            material.alpha = 1;
            material.dragging = false;
            material.data = null;

            if(checkArea(material, hitAreaMesa)){
                moveScale.to(material,{
                    pixi:{
                        x: 500,
                        y:360,
                    }
                })
            }else{
                material.x = 660;
                material.y = 560;
            }
            
        }

        // initial position, first timeline.
        function initialPosition() {
            const initial = gsap.timeline({
                delay: 1,
            });

            /* initial position code */

            return initial;
        }

        // calling mainTimeline
        mainTimeline();
    });
})();

},{"./functions":2,"./objects":3,"./setup-v3":4,"./texts":5}],2:[function(require,module,exports){
//generates random numbers
const randomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min) + min);

const randomFloatNumber = (min, max) =>
    (Math.random() * (max - min) + min).toFixed(2);

const size = (app, obj, width, height) => {
    if (typeof obj == "object") {
        obj.pivot.set(obj.width / 2, obj.height / 2);
        obj.width = width;
        obj.height = height;
    } else if (typeof obj == "array") {
        obj = width;
        obj = height;
    }
    app.stage.addChild(obj);
};

const position = (app, obj, x, y) => {
    if (typeof obj == "object") {
        obj.pivot.set(obj.width / 2, obj.height / 2);
        obj.x = x;
        obj.y = y;
    } else if (typeof obj == "array") {
        obj = x;
        obj = y;
    }
    app.stage.addChild(obj);
};

const configureObject = ( app, object, width, height, x, y, moveItem = false, visible = true) => {
    position(app, object, x, y);
    size(app, object, width, height);
    if (moveItem) {
        object.interactive = true;
        object.buttonMode = true;
    }
    object.visible = visible
    
    app.stage.addChild(object);
};


class ConfigureText extends PIXI.Text{
    constructor(app,text, x, y, visible = true){
        super(text);
        this.x = x;
        this.y = y
        this.visible = visible;
        this.anchor.set(0.5)
        this.style = {fontFamily: "Tahoma", fontSize: 14, lineHeight: 17, fill: 0xffffff,align: "left"}

        app.stage.addChild(this)

        
    }
}
function checkArea(object1, object2) {
    const bounds1 = object1.getBounds();
    const bounds2 = object2.getBounds();

    return (
        bounds1.x < bounds2.x + bounds2.width &&
        bounds1.x + bounds1.width > bounds2.x &&
        bounds1.y < bounds2.y + bounds2.height &&
        bounds1.y + bounds1.height > bounds2.y
    );
}

module.exports = {
    randomNumber,
    randomFloatNumber,
    configureObject,
    checkArea,
    ConfigureText
}
},{}],3:[function(require,module,exports){
//const {introOptions} = require('./intro');
//const {footerOptions} = require('./footer');
const { configureObject,ConfigureText } = require('./functions');
const texts = require('./texts');

const options = {
    width: 800,
    height: 600,
    backgroundColor: 0x7193bc,
    targetSelector: "#animation",
    fontFamilies: ["Roboto", "DS-DIGI"],
    resources: {
        
        cartesianPlan:"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p03-estufa/background.png",//Plano CartesiAno
        table: "https:lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/mesa+perfil+.png", // mesa
        hitAreaMesa: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/hitbox-requa.png",
        hitAreaBicodeBunsen:"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/hitbox-corpoDeProva.png",
        hitAreaFioDeCobre:"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/hitbox-corpoDeProva.png",
        hitAreaPalitodeMadeira:"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/hitbox-corpoDeProva.png",

    },
};


// load openning resources
if (introOptions) {
    Object.keys(introOptions.resources).forEach((id) => {
        options.resources[id] = introOptions.resources[id];
    });
}

// load footer resources
if (footerOptions) {
    Object.keys(footerOptions.resources).forEach((id) => {
        options.resources[id] = footerOptions.resources[id];
    });
}

const createObjects = (app, resources) => {
    let allObjects = {};

    // criando as Sprites
    const table = PIXI.Sprite.from(resources.table.texture);
    configureObject(app, table, 880, 200, 400, 625);
    allObjects.table = table;

    const hitAreaMesa = PIXI.Sprite.from(resources.hitAreaMesa.texture);
    configureObject(app, hitAreaMesa, 350, 50, 400, 530);
    allObjects.hitAreaMesa = hitAreaMesa;

    // BicoDeBunsen
    const hitAreaBicodeBunsen = PIXI.Sprite.from(resources.hitAreaBicodeBunsen.texture);
    configureObject(app, hitAreaBicodeBunsen, 50, 100, 100, 505, true, true);
    allObjects.hitAreaBicodeBunsen = hitAreaBicodeBunsen;
    // materials
    const hitAreaFioDeCobre = PIXI.Sprite.from(resources.hitAreaFioDeCobre.texture);
    configureObject(app, hitAreaFioDeCobre, 150, 20, 660, 530, true, true);

    const hitAreaPalitodeMadeira = PIXI.Sprite.from(resources.hitAreaFioDeCobre.texture);
    configureObject(app, hitAreaPalitodeMadeira, 150, 20, 660, 560, true, true);

    //Array com os materiais
    const objctsmaterials = [hitAreaFioDeCobre, hitAreaPalitodeMadeira];
  allObjects.objctsmaterials = objctsmaterials;



    // o plano cartesiano sempre será adicionado por último, 
    //para sobrepor todas as outras imagens
    const background = new PIXI.Sprite(resources.cartesianPlan.texture);
    configureObject(app, background, 800, 601, 400, 300);
    background.alpha = 0.3;
    background.visible = true;


    return allObjects
}


module.exports = {
    options, createObjects
}
},{"./functions":2,"./texts":5}],4:[function(require,module,exports){
const setup = (options, onReady) => {
    const settings = {
        width: options.width,
        height: options.height,
        backgroundColor: options.backgroundColor,
        antialias: true
    }

    let app;
    PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = false;

    // WebGL support condition
    if(PIXI.utils.isWebGLSupported()){
        app = new PIXI.Application(settings);
    }else{
        settings.forceCanvas = true;
        app = new PIXI.Application(settings);
    }


    const fontsToLoad = [];
    options.fontFamilies.forEach(fontFamily => {
        const font = new FontFaceObserver(fontFamily);
        fontsToLoad.push(font);
    });


    document.querySelector(options.targetSelector).appendChild(app.view);
    
    PixiPlugin.registerPIXI(PIXI);

    const pixiLoader = new PIXI.Loader();
    Object.keys(options.resources).forEach(id => {
        pixiLoader.add(id, options.resources[id]);
    })

    Promise.all(
        fontsToLoad.map(font => font.load())
    ).then(() => {
        pixiLoader.load((_,pixiResources)=>{
            onReady(app,pixiResources)
        });
    });
}

module.exports = setup;
},{}],5:[function(require,module,exports){
module.exports={
    "footer" : {
        "credits": "\n\nIury Sousa, Jailson Junior, Maurício Alves, Emerson José, Thiago Nascimento, Angélica Martiniano, Ana Carolina, Heloisa Pimentel, Adilson Da Silva\n\nCopyright ©\n\nDesenvolvido pelo Laboratório de Inovações acadêmicas - Grupo Ser Educacional. Todos os direitos reservados."
    }
}
},{}]},{},[1]);
