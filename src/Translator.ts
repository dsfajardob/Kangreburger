import { writeFileSync, mkdirSync, existsSync } from 'fs';

export class  Translator{
    
    CurrentLanguaje = new Map();
    //supported languajes
    ESP = new Map();
    ENG = new Map();
    FRA = new Map();
    DEU = new Map();
    //containers to do
    Containers:Array<String> =[];

    public translate(code: String,rootDirectory: String): void{
        
        //First get the parts of the code getting an array splited by "\n"
        let parts = code.split("\n");
        //console.log(parts);
        this.getLanguage(parts[0]);
        
        //now get the code from almeja to Docker
        let dockerCode = "FROM ";
        this.getContainers(parts[0]);
        //console.log(this.Containers);

        //Create the respective files
        this.Containers.forEach(element => {

            dockerCode = dockerCode + element;
            
            //get the containers
            for (let index = 1; index < parts.length; index++) {
                //check if are in the body of the current container
                //console.log(element);
                
                if(parts[index].includes(String(element)))
                {
                    //console.log("asdasd");
                    
                    this.getRules(parts[index]);
                    break;
                }
                    
            }
            

            /*            
            //Create de directory if doesn't exist and the dockerfile as well 
            let fileDirectory = rootDirectory +'/'+ element; 
            if(!existsSync(fileDirectory))
            {
                mkdirSync(fileDirectory);
            }
            writeFileSync(fileDirectory +'/DOCKERFILE' , dockerCode);
            */
            dockerCode = "FROM ";
        });
        
        console.log("DONE!");
        
    }

    private getLanguage(firstPart: String){    

        this.initMaps();
        let firstWord = firstPart.split(" ")[0];
        
        if(this.ESP.get(firstWord)){        //Spanish
            this.CurrentLanguaje =  this.ESP;
        }
        else if (this.ENG.get(firstWord)) { //English
            this.CurrentLanguaje =  this.ENG;
        }
        else if (this.FRA.get(firstWord)) { //French
            this.CurrentLanguaje =  this.FRA;
        } 
        else if (this.DEU.get(firstWord)) { //Deucht
            this.CurrentLanguaje =  this.DEU;
        }
    }

    getContainers(firstPart: String){

        //console.log(firstPart);
        let containers = firstPart.split(" ");
        for (let index = 3; index < containers.length; index++) {            
            let container: String = "";

            if(containers[index].indexOf(",")>= 0){
                container = containers[index].slice(0,containers[index].indexOf(",")); 
            }
            else if(containers[index].indexOf(":")>= 0){
                container = containers[index].slice(0,containers[index].indexOf(":"));
            }
           this.Containers.push(container);
            //console.log(container);                    
        }        
    }

    getRules(containerBody: String): String
    {
        //takes the part after the ":" because is the body
        //and split this to check every word in case this
        //word is a reserverd word by the languaje
        let body = containerBody.split(":")[1].split(" ");
        body.forEach(word => {
            //console.log(word + "    testlight");
            
            if(this.reservedWords.includes(word))
            {
                //console.log(word);
                
            }
        });
        
        
        return " ";
    }

    private initMaps(){
        this.initESP();
        this.initENG();
        this.initDEU();
        this.initFRA();
    }

    private initESP(){
        this.ESP.set("NECESITO","x");
        //this.ESP.set("DE","FROM");
        this.ESP.set("EJECUTE","RUN");
        this.ESP.set("ETIQUETA","LABEL");
        this.ESP.set("ETIQUETAS","LABEL");
        this.ESP.set("PUERTO","EXPOSE");
        this.ESP.set("ENTORNO","ENV");
        this.ESP.set("AGREGANDO","ADD");
        this.ESP.set("COPIANDO","COPY");
        this.ESP.set("INCIANDO","ENTRYPOINT");
        this.ESP.set("UBICACION","VOLUME");
        this.ESP.set("VOLUMEN","VOLUME");
        this.ESP.set("USUARIO","USER");
        this.ESP.set("DIRECTORIO","DIR");
        this.ESP.set("ARGUMENTO","ARG");
        this.ESP.set("ARGUMENTOS","ARG");
        this.ESP.set("CONSTRUIR","ONBUILD");
        this.ESP.set("DETENIENDO","STOPSIGNAL");
        this.ESP.set("NADA","HEALTHCHECK");
        this.ESP.set("REVISANDO","HEALTHCHECK");
        this.ESP.set("SHELL","SHELL");
        this.ESP.set("CMD","CMD");
    }

    
    //Here the language map most be initilialized
    initENG(){

    }
    //Here the language map most be initilialized
    initDEU(){

    }
    //Here the language map most be initilialized
    initFRA(){

    }
    
    reservedWords = [
        "NECESITO",
        "DE",
        "QUE",
        "EJECUTE",
        "CON",
        "LA",
        "ETIQUETA",
        "LAS",
        "LOS",
        "ETIQUETAS",
        "EN",
        "EL",
        "PUERTO",
        "VARIABLE",
        "ENTORNO",
        "VARIABLES",
        "AGREGANDO",
        "COPIANDO",
        "INICIANDO",
        "UBICACION",
        "VOLUMEN",
        "PARA",
        "USUARIO",
        "DIRECTORIO",
        "TRABAJO",
        "ARGUMENTO",
        "ARGUMENTOS",
        "CONSTRUIR",
        "DETENIENDO",
        "A",
        "REVISANDO",
        "NADA",
        "SHELL",
        "CMD",
    ];
}
