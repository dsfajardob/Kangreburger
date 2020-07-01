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
            if(element)
            {
                dockerCode = dockerCode + element;
            
                //get the containers
                for (let index = 1; index < parts.length; index++) {
                    //check if are in the body of the current container
                    //console.log(element);
                    if(parts[index].includes(String(element)))
                    {
                        //console.log("asdasd");                    
                        dockerCode = dockerCode  + this.getRules(parts[index]);
                        break;
                    }
                        
                }
                //console.log(dockerCode); 
                //Create de directory if doesn't exist and the dockerfile as well 
                let fileDirectory = rootDirectory +'/'+ element; 
                if(!existsSync(fileDirectory))
                {
                    mkdirSync(fileDirectory);
                }
                writeFileSync(fileDirectory +'/DOCKERFILE' , dockerCode);
                
                //restart code
                
                dockerCode = "FROM ";
            }
        });
        //console.log("DONE!");
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

            if(containers[index].indexOf(",") >= 0){
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
        let dockerBody = "";
        let currentRule = "";
        body.forEach(word => {
            //console.log(word + "    testlight");
            //here 
            if(this.reservedWords.includes(word)){
                //console.log(word);
                if(this.CurrentLanguaje.get(word)){
                    currentRule = this.CurrentLanguaje.get(word);
                    dockerBody = dockerBody + "\n" + currentRule;
                }                
            } else { //in case dont, just add to the file
                //si existe una coma son varios parametros asi que metalos
                if(word === "," || word.indexOf(",") >= 0 ){
                    
                    word = word.slice(0,word.indexOf(","));
                    dockerBody = dockerBody + " " + word + "\n" + currentRule;
                    //console.log("UNA COMA");
                } else {
                    dockerBody = dockerBody + " " + word;
                }
            }
        });
        //console.log(dockerBody);
        //console.log("finish");
        return dockerBody;
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
        this.ESP.set("INICIANDO","ENTRYPOINT");
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
        this.ENG.set("NEED","x");
        //this.ESP.set("DE","FROM");
        this.ENG.set("RUNS","RUN");
        this.ENG.set("TAG","LABEL");
        this.ENG.set("TAGS","LABEL");
        this.ENG.set("PORT","EXPOSE");
        this.ENG.set("ENVIRONMENTAL","ENV");
        this.ENG.set("ADDING","ADD");
        this.ENG.set("COPYING","COPY");
        this.ENG.set("STARTING","ENTRYPOINT");
        this.ENG.set("LOCATION","VOLUME");
        this.ENG.set("VOLUME","VOLUME");
        this.ENG.set("USER","USER");
        this.ENG.set("DIRECTORY","DIR");
        this.ENG.set("ARGUMENT","ARG");
        this.ENG.set("ARGUMENTS","ARG");
        this.ENG.set("BUILDING","ONBUILD");
        this.ENG.set("STOPPING","STOPSIGNAL");
        this.ENG.set("NONE","HEALTHCHECK");
        this.ENG.set("CHECKING","HEALTHCHECK");
        this.ENG.set("SHELL","SHELL");
        this.ENG.set("CMD","CMD");
    }
    //Here the language map most be initilialized
    initDEU(){

    }
    //Here the language map most be initilialized
    initFRA(){

    }
    
    reservedWords = [
        "NECESITO", //
        "NEED",

        "DE",//
        "OF",

        "QUE",//
        "THAT",

        "EJECUTE",//
        "RUNS",

        "CON",//
        "WITH",

        "ETIQUETA",//
        "TAG",

        "ETIQUETAS",//
        "TAGS",

        "EN",//
        "AT",
        "TO",

        "EL",//
        "LA",//
        "THE",
        "LAS",//
        "LOS",//

        "PUERTO",//
        "PORT",

        "VARIABLE",//

        "ENTORNO",//
        "ENVIRONMENTAL",

        "VARIABLES",//

        "AGREGANDO",//
        "ADDING",

        "COPIANDO",//
        "COPYING",

        "INICIANDO",//
        "STARTING",

        "UBICACION",//
        "LOCATION",

        "VOLUMEN",//
        "VOLUME",

        "PARA",//
        "FOR",

        "USUARIO",//

        "DIRECTORIO",//
        "DIRECTORY",

        "TRABAJO",//
        "WORK",

        "ARGUMENTO",//
        "ARGUMENT",

        "ARGUMENTOS",//
        "ARGUMENTS",

        "CONSTRUIR",//
        "BUILDING",

        "DETENIENDO",//
        "STOPPING",

        "A",//
        "AN",

        "AL",//
        "WHEN",

        "REVISANDO",//
        "CHECKING",

        "NADA",
        "NONE",

        "SHELL",//
        "CMD",//
    ];
}
