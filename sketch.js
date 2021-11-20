var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var feedButton
var foodObj;

var hour;

//crea aquí las variables feed y lastFed 
var feed,lastFed;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //crea aquí el boton Alimentar al perro
  feedButton = createButton("Alimentar al perro");
  feedButton.position(800,150);
  feedButton.mousePressed(feedDog);

  addFood=createButton("Agregar Alimento");
  addFood.position(800,125);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //escribe el código para leer el valor de tiempo de alimentación de la base de datos
  var lastFedTime = database.ref('FeedTime');
  lastFedTime.on("value",(data)=>{
    lastFed = data.val();
  })

  
 
  //escribe el código para mostrar el texto lastFed time aquí
  
  
  //lastFed = lastFed -12;
  fill("cyan");

  if(hour() >= 12){
    //lastFed = lastFed -12
    text("Última hora en que se alimentó : " + lastFed + " PM", 350,30);
  }
  else if(hour() == 0){
    text("Última hora en que se alimentó : 12 AM", 350,30);
  }
  else{
    //lastFed = lastFed +12
    text("Última hora en que se alimentó : " + lastFed + " AM", 350,30);
  }
  
  
  //feedTime();
 
  drawSprites();

  //console.log(hour);
}

//función para leer la Existencia de alimento
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  if(foodS > 0){
    dog.addImage(happyDog);

  //escribe el código aquí para actualizar las existencia de alimento, y la última vez que se alimentó al perro
    var food_stock_val = foodObj.getFoodStock();
    if(food_stock_val <= 0){
      foodObj.updateFoodStock(food_stock_val *0);
    }
    else
    {
      foodObj.updateFoodStock(food_stock_val -1);
    }

    
    foodS = foodS - 1
    database.ref('/').update({
      Food:foodS
    })

    

    lastFed = hour()

    if(hour() >= 12){
      lastFed = lastFed -12
    }

    database.ref('/').update({
      FeedTime:lastFed
    })
  }
}

//funcón para agregar alimento al almacén
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

/*function feedTime(){
  database.ref('/').update({
    FeedTime:lastFed
  })
}
/*async function time(){
  var response = await fetch("http://worldtimeapi.org/api/timezone/America/Monterrey");
  var responseJSON = await response.json();

  var datetime = responseJSON.datetime;
  hour = datetime.slice(11,13);
}*/