var database;
var dog, sadDog, happyDog;
var foodValue, foodStock;
var fedTime, lastFed;
var feed, addFood;
var food;
var isHavingMilk = false;
var timer;

function preload()
{
  sadDog = loadImage("images/Dog.png");
  happyDog = loadImage("images/happy dog.png");
}

function setup()
{
  createCanvas(1000, 400);

  timer = 2;
  database = firebase.database();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock, showError);

  food = new Food();
  
  dog = createSprite(800, 200, 150, 150);
  dog.addImage(sadDog);
  dog.scale = 0.15;
  
  feed = createButton("Feed the dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoodStock);
}

function draw()
{
  background(46, 139, 87);

  if(lastFed !== undefined || food !== undefined)
  {
    food.display();

    fedTime = database.ref('FeedTime');
    fedTime.on("value", function(data)
    {
      lastFed = data.val();
    });

    if (frameCount % 30 == 0 && timer > 0)
    {
      timer--;
    }

    if (timer == 0)
    {
      dog.addImage(sadDog);
      isHavingMilk = false;
    }

    fill("white");
    textSize(15);

    if(lastFed >= 12)
    {
      text("Last Feed : "+ lastFed % 12 + " PM", 350, 30);
    }
    else if(lastFed === 0)
    {
      text("Last Feed : 12 AM", 350, 30);
    }
    else
    {
      text("Last Feed : "+ lastFed + " AM", 350, 30);
    }

    drawSprites();
  }
}

function readStock(data)
{
  foodValue = data.val();
  food.updateFoodStock(foodValue);
}

function showError()
{
  console.error("Error in writing to database!!");
}

function feedDog()
{
  dog.addImage(happyDog);
  timer = 2;
  isHavingMilk = true;

  food.deductFood();
  food.updateFoodStock(food.getFoodStock());
  database.ref('/').update(
  {
    Food: food.getFoodStock(),
    FeedTime: hour()
  });
}

function addFoodStock()
{
  foodValue++;
  database.ref('/').update(
  {
    Food: foodValue
  });
}