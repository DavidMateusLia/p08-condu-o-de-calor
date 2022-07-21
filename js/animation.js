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
