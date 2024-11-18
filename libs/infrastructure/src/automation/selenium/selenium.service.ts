import { Builder, By, Key, until, WebDriver } from "selenium-webdriver";
import delay from "delay";

const prueba = async (): Promise<void> => {
  let driver: WebDriver = await new Builder().forBrowser("chrome").build();

  // Maximize open page
  driver.manage().window().maximize();

  // GET REQUEST
  await driver.get("https://epay-manager.smdigital.cl/");

  await delay(4000);

  await driver.findElement(By.className("login")).click();

  await delay(6000);

  await driver
    .findElement(By.id("userNameInput"))
    .sendKeys("francisco.roavalenzuela@externos-cl.cencosud.com");

  await driver.findElement(By.id("passwordInput")).sendKeys("Fr@nColo1990");

  await delay(200);

  await driver.findElement(By.id("submitButton")).click();

  await delay(10000);

  await driver.findElement(By.className("swal-button")).click();
};

prueba();