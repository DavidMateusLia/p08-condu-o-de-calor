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