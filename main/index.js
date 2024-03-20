const {
  By,
  Builder,
  until,
  Key,
  Actions
} = require("selenium-webdriver");
let {
  baseUrl,
  email,
  pass,
  filePath,
  fileName,
  loom_url
} = require("../crediantial.json");
let {
  isTimeout,
  execution
} = require("../masterdata.json")
const assert = require('assert');
const chrome = require("selenium-webdriver/chrome");
const {
  actionWithRetry,
  log
} = require('./loadfile');
let options = new chrome.Options();
//for the headless mode
//options.addArguments('--headless', '--window-size=1440,900');
//for the headless mode
//const driver = new Builder().forBrowser("chrome").setChromeOptions(options).build();
const path = require('path');
const fs = require('fs');
//for the ui mode
driver = new Builder().forBrowser("chrome").build();
describe("login page", function () {
  //login the page
  it("login the page", async function () {
    log(':starting login the page')
    await driver.manage().window().maximize();
    log(':sstep 2')
    await driver.get(baseUrl);
    log(':step 3')
    log(':step 3a')
    const emailElementLocator = By.xpath("//input[@id='email']");
    // maxRetries = 4
    // timeout = 30000ms
    await actionWithRetry(driver, async function (element) {
      await element.sendKeys(email);
    }, emailElementLocator, 4, 1000);

    const passwordElementLocator = By.xpath("//input[@id='password']");
    await actionWithRetry(driver, async function (element) {
      await element.sendKeys(pass);
    }, passwordElementLocator);

    const loginButtonLocator = By.xpath("//button[@class='btn-md btn-black btn group/btn']");
    await actionWithRetry(driver, async function (element) {
      await element.click();
    }, loginButtonLocator);
    await driver.navigate().refresh();
    log(':step 4')
  })
    it("Upload a csv file", async function () {
      log(':step 5:starting Upload a csv file')
      //click on nav bar icon
      let clickicon = By.xpath("(//button[@class='btn polymer-navbar-link'])[1]");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, clickicon, 4, 2000);
      //upload file
      let uploadfile = filePath;
      console.log(':uploadfile', uploadfile);
      // just wait for the Add New Data Source button to appear before proceeding
      await actionWithRetry(driver, async function (element) {}, By.xpath("//span[text()=' Add New Data Source ']"), 4, 1500);
      log(':step 6:traverse the loop to get the csv name from the popup')
      //traverse the loop to get the csv name from the popup
      const elements = await driver.findElements(By.xpath("(//div[@class='dataset-name w-5/12 font-medium text-sm leading-4 text-black cursor-pointer'])"));
      let getText;
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        try {
          await driver.wait(until.elementIsVisible(element), isTimeout);
          getText = await element.getText();
        } catch (err1) {
          console.log("error on upload popup", err1)
        }
        console.log(':getText', getText);
        console.log(':fileName', fileName);
        //if the csv name matched
        if (getText === fileName) {
          log(':file exists, deleting file and uploading file')
          //click on action
          let clickaction = By.xpath(`(//div[@class='caret-wrapper ml-2'])[${i+1}]`);
          log(':step 7a:click on action')
          await actionWithRetry(driver, async function (element) {
            await element.click();
          }, clickaction);
          //click on delete button to delete the csv file
          let deletecsv = By.xpath("(//span[text()='Delete'])[3]");
          log(':step 7b:click on delete button')
          await actionWithRetry(driver, async function (element) {
            await element.click();
          }, deletecsv);
          //confirm to delete 
          let confirmdelete = By.xpath("//button[text()=' Yes, Delete Source']");
          log(':step 7c:confiem to delete source')
          await actionWithRetry(driver, async function (element) {
            await element.click();
          }, confirmdelete);
          //click on to add data source button
          let clickaddnewsourcedata = By.xpath("//span[text()=' Add New Data Source ']");
          log(':step 7d:Click on add new data source')
          await actionWithRetry(driver, async function (element) {
            await element.click();
          }, clickaddnewsourcedata, 6, 3000);
          log(':step 7e:uploading the file')
          driver.findElement(By.xpath("(//input[@type='file'])[2]")).sendKeys(uploadfile);
          break;
        } else {
          log('step 8:enter the else condintion and uploading file')
          //file upload
          let clickaddnewsourcedata = By.xpath("//span[text()=' Add New Data Source ']");
          await actionWithRetry(driver, async function (element) {
            await element.click();
          }, clickaddnewsourcedata);
          await driver.sleep(2000);
          driver.findElement(By.xpath("(//input[@type='file'])[2]")).sendKeys(uploadfile);
          console.log(':file uploading done');
          break;
        }
      }
    });

    //Create time series
    it("Create time series", async function () {
      log(':starting Create time series')
      await driver.sleep(4000);
      try {
        let test = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//h3[text()='Add your data source']"))), 30000).getText();
        log("after test")

        // sometimes add data popup shows even after data upload
        if (test == "Add your data source") {
          log("step14:enter the close condition")
          let closepopup = By.xpath("//div[@class='polymer-close-icon']")
          await actionWithRetry(driver, async function (element) {
            await element.click();
          }, closepopup, 3, 10000);
        } else {
          log("step14: enter the else close condition")
        }
      } catch (error) {
        console.log("dd your data source error", error)
      }

      log(':after')

      // wait until Suggested Insights shows up
      await actionWithRetry(driver, async function (element) {}, By.xpath("//div[text()='Suggested Insights']"), 4, 3000);


      log(':step 8')

      //click on add icon
      let clickadd = By.xpath("(//div[@class='v-popper v-popper--theme-dropdown'])[1]");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, clickadd);
      //click on time series
      let clickontimeseries = By.xpath("//button[text()=' Time Series']");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, clickontimeseries);
      //click on the record count
      let clickonyaxis = By.xpath("(//div[@class='multiselect__tags'])[2]");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, clickonyaxis);
      //send y axis value
      let sendxaxis = By.xpath("(//input[@type='text'])[2]");
      await actionWithRetry(driver, async function (element) {
        await element.sendKeys("All Conv. Rate")
      }, sendxaxis);
      let selectxaxis = By.xpath("(//input[@type='text'])[2]");
      await actionWithRetry(driver, async function (element) {
        await element.sendKeys(Key.ENTER)
      }, selectxaxis);
      await driver.sleep(2000);
      let close = By.xpath("//button[@class='ml-1.5']");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, close);
    })
    //traverse the graph
    it("traverse the graph", async function () {
      log(':starting traverse the graph')
      const chartelements = "(//*[local-name()='svg']//*[name()='g' and @class='highcharts-markers highcharts-series-1 highcharts-line-series highcharts-tracker' ]//*)"
      for (let m = 2; m <= 32; m++) {
        const elements = await driver.findElements(By.xpath(`${chartelements}[${m}]`));
        await driver.actions().move({
          origin: elements[0]
        }).perform();
      }
    })
   
  execution.forEach((item) => {
    //verify the timeseries data
       it("verify the timeseries data", async function () {
         log(':starting verify the timeseries data')
         const chartelements = "(//*[local-name()='svg']//*[name()='g' and @class='highcharts-markers highcharts-series-1 highcharts-line-series highcharts-tracker' ]//*)"
         let text = "//div[@class='inline-flex px-3 py-2 text-black flex-col drop-shadow-big font-normal']"
         for (let m = 2; m <= 32; m++) {
           const elements = await driver.findElements(By.xpath(`${chartelements}[${m}]`));
           await driver.actions().move({
             origin: elements[0]
           }).perform();
           await driver.sleep(100);
           let test = await driver.findElement(By.xpath(text)).getText();
           //  let test = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(text))), isTimeout).getText();
           console.log("testing", test);
           const extractedText = test.split('\n')[0].trim();
           console.log("Extracted text:", extractedText);
           const startIndex = test.indexOf("All Conv. Rate: ") + "All Conv. Rate: ".length;;
           const actual_conv_rate = test.substring(startIndex);
           const actual_month_data = extractedText
           console.log("actual_conv_rate", actual_conv_rate)
           for (let n = 0; n < item.time_series_chart[0].verification[0].month.length; n++) {
             if (extractedText === item.time_series_chart[0].verification[0].month[n]) {
               console.log("inside the loop")
               await driver.sleep(10);
               //verify month,day,year
               const expected_month_data = item.time_series_chart[0].verification[0].month[n]
               assert.equal(expected_month_data, actual_month_data);
               //verify the conv rate
               const expected_conv_rate = item.time_series_chart[0].verification[0].all_conv_rate[n]
               assert.equal(expected_conv_rate, actual_conv_rate);
               // wait for 20ms before iterating next item
               await driver.sleep(20);
               break;
             }
           }
         }
       })
       //create coloumn and bar chart
       it("create coloumn and bar chart", async function () {
         log(':create coloumn and bar chart')
         //click on add icon
         let clickadd = By.xpath("(//div[@class='v-popper v-popper--theme-dropdown'])[1]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickadd);
         //click on time series
         let clickontimeseries = By.xpath("//button[text()=' Column & Bar Chart']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickontimeseries);
         //click on the record count
         let clickonxaxis = By.xpath("(//div[@class='multiselect__tags'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonxaxis);
         //send x axis value
         let sendxaxis = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Ad Name")
         }, sendxaxis);
         let selectxaxis = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectxaxis);
         //send y axis
         let clickonyaxis = By.xpath("(//div[@class='multiselect__tags'])[3]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonyaxis);
         let sendyaxis = By.xpath("(//input[@type='text'])[3]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Ctr")
         }, sendyaxis);
         let selectyaxis = By.xpath("(//input[@type='text'])[3]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectyaxis);
         //send the avg 
         let clickonsendavg = By.xpath("(//div[@class='multiselect__tags'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonsendavg);
         let selectavg = By.xpath("(//input[@type='text'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Avg")
         }, selectavg);
         let clickavg = By.xpath("(//input[@type='text'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, clickavg);
         await driver.sleep(2000);
         let close = By.xpath("//button[@class='ml-1.5']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, close);
       })
       //traverse the graph
       it("traverse the graph", async function () {
         log(':starting traverse the graph of coloum and bar chart')
         const chartelements = "(//*[local-name()='svg']//*[name()='g' and @class='highcharts-series highcharts-series-0 highcharts-column-series highcharts-color-0 highcharts-tracker' ]//*)"
         for (let m = 1; m <= 14; m++) {
           const elements = await driver.findElements(By.xpath(`${chartelements}[${m}]`));
           await driver.actions().move({
             origin: elements[0]
           }).perform();
         }
       })
       //verify the coloum and bar chart data
       it("verify the coloum and bar chart data", async function () {
         log(':starting to verify the coloum and bar chart data')
         const chartelements = "(//*[local-name()='svg']//*[name()='g' and @class='highcharts-series highcharts-series-0 highcharts-column-series highcharts-color-0 highcharts-tracker' ]//*)"
         let text = "(//div[@class='inline-flex px-3 py-2 text-black flex-col drop-shadow-big font-normal'])[2]"
         for (let m = 2; m <= 14; m++) {
           const elements = await driver.findElements(By.xpath(`${chartelements}[${m}]`));
           await driver.actions().move({
             origin: elements[0]
           }).perform();
           await driver.sleep(100);
           let test = await driver.findElement(By.xpath(text)).getText();
           console.log("testing", test)
           const startCtrIndex = test.indexOf("Ctr: ") + "Ctr: ".length;;
           const actual_ctr_value = test.substring(startCtrIndex);
           const startOperationIndex = test.indexOf("Operation: ") + "Operation: ".length;
           const endOperationIndex = test.indexOf("\n", startOperationIndex);
           const actual_operation_name = test.substring(startOperationIndex, endOperationIndex).trim();
           const startIndex = test.indexOf("Ad Name: ") + "Ad Name: ".length;
           const endIndex = test.indexOf("\n", startIndex);
           const actual_ad_name = test.substring(startIndex, endIndex).trim();

           console.log("actual_ad_name", actual_ad_name)
           for (let n = 0; n < item.coloum_and_bar_chart[0].verification[0].verify_adName.length; n++) {
             if (actual_ad_name === item.coloum_and_bar_chart[0].verification[0].verify_adName[n]) {
               console.log("inside the loop")
               await driver.sleep(10);
               //verify ad name data
               const expected_ad_name = item.coloum_and_bar_chart[0].verification[0].verify_adName[n]
               assert.equal(expected_ad_name, actual_ad_name);
               //verify the operation
               const expected_operation_name = item.coloum_and_bar_chart[0].verification[0].verify_operation[n]
               assert.equal(expected_operation_name, actual_operation_name);
               //verify ctr
               const expected_ctr_value = item.coloum_and_bar_chart[0].verification[0].verify_ctr[n]
               assert.equal(expected_ctr_value, actual_ctr_value);
               await driver.sleep(20);
               break;
             }
           }
         }
       })
     /*  
       //create the line plot
       it("create the line plot", async function () {
         log(':create the line plot')
         //click on add icon
         let clickadd = By.xpath("(//div[@class='v-popper v-popper--theme-dropdown'])[1]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickadd);
         //click on line plot
         let clickonlineplot = By.xpath("//button[text()=' Line Plot']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonlineplot);
         //send y axis
         let clickonyaxis = By.xpath("(//div[@class='multiselect__tags'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonyaxis);
         let sendyaxis = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Cost / conv")
         }, sendyaxis);
         let selectyaxis = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectyaxis);
         let clickonxaxis = By.xpath("(//div[@class='multiselect__tags'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonxaxis);
         //send x axis value
         let sendxaxis = By.xpath("(//input[@type='text'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("conversions")
         }, sendxaxis);
         let selectxaxis = By.xpath("(//input[@type='text'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectxaxis);
         await driver.sleep(2000);
         let close = By.xpath("//button[@class='ml-1.5']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, close);
       })
       //traverse the line plot graph
       it("traverse the line plot graph", async function () {
         log(':traverse the line plot graph')
         const chartelements = "(//*[local-name()='svg']//*[name()='g' and @transform='translate(64,10) scale(1 1)' ]//*)"
         for (let m = 4; m <= 17; m++) {
           const elements = await driver.findElements(By.xpath(`${chartelements}[${m}]`));
           await driver.actions().move({
             origin: elements[0]
           }).perform();
         }
       })
       //verify the line plot data
       it("verify the line plot data", async function () {
         log(':starting traverse verify the line plot data')
         const chartelements = "(//*[local-name()='svg']//*[name()='g' and @transform='translate(64,10) scale(1 1)' ]//*)"
         let text = "(//div[@class='inline-flex px-3 py-2 text-black flex-col drop-shadow-big font-normal'])[2]"
         for (let m = 4; m <= 18; m++) {
           const elements = await driver.findElements(By.xpath(`${chartelements}[${m}]`));
           await driver.actions().move({
             origin: elements[0]
           }).perform();
           await driver.sleep(1000);
           let test = await driver.findElement(By.xpath(text)).getText();
           console.log("testing", test)
           const lines = test.split('\n');
           const actual_operation_name = lines[0].replace('Operation: ', '').trim();
           const actual_cost_conv_value = lines[1].replace('Cost / Conv.: ', '').trim();
           const actual_conversion_value = lines[2].replace('Conversions: ', '').trim();

           console.log("actual_operation_name", actual_operation_name);
           console.log("actual_cost_conv_value", actual_cost_conv_value);
           console.log("actual_conversion_value", actual_conversion_value);

           for (let n = 0; n < item.line_plot_chart[0].verification[0].verify_operation.length; n++) {
             if (actual_conversion_value === item.line_plot_chart[0].verification[0].verify_conversions[n]) {
               console.log("inside the loop")
               await driver.sleep(10);
               //verify Cost / Conv data
               const expected_cost_conv_value = item.line_plot_chart[0].verification[0].verify_cost_conv[n]
               assert.equal(expected_cost_conv_value, actual_cost_conv_value);
               console.log("expected_cost_conv_value", expected_cost_conv_value)
               //verify the operation
               const expected_operation_name = item.line_plot_chart[0].verification[0].verify_operation[n]
               assert.equal(expected_operation_name, actual_operation_name);
               console.log("expected_operation_name", expected_operation_name)
               //verify conversion
               const expected_conversion_value = item.line_plot_chart[0].verification[0].verify_conversions[n]
               assert.equal(expected_conversion_value, actual_conversion_value);
               console.log("expected_conversion_value", expected_conversion_value)
               await driver.sleep(20);
               break;
             }
           }
         }
       })
       //create score card chart for the clicks
       it("create score card chart for the clicks", async function () {
         log(':create score card chart for the clicks')
         //click on add icon
         let clickadd = By.xpath("(//div[@class='v-popper v-popper--theme-dropdown'])[1]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickadd);
         //click on scorecard
         let clickonscorecard = By.xpath("//button[text()=' Scorecard']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonscorecard);
         //click on to select kpi metric
         let clickonxaxis = By.xpath("(//div[@class='multiselect__tags'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonxaxis);
         //send the kpi metric clicks
         let sendkpimetric = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Clicks")
         }, sendkpimetric);
         //select the kpi metric
         let selectmetric = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectmetric);
         await driver.sleep(2000);
         let close = By.xpath("//button[@class='ml-1.5']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, close);
       })
       //verify the scorecard with clicks
       it("verify the scorecard data for the clicks", async function () {
         log(':verify the scorecard data for the clicks')
         await driver.sleep(2000);
         let actual_click_scorecard = await driver.findElement(By.xpath("(//span[@class='text-3xl break-all'])[1]")).getText();
         let expected_click_scorecard = item.scorecard_chart[0].verification[0].verify_clicks_scorecard;
         assert.equal(expected_click_scorecard, actual_click_scorecard)
       })
       //create score card chart for the avg cpc
       it("create score card chart for the avg cpc", async function () {
         log(':create score card chart for the avg cpc')
         //click on add icon
         let clickadd = By.xpath("(//div[@class='v-popper v-popper--theme-dropdown'])[1]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickadd);
         //click on scorecard
         let clickonscorecard = By.xpath("//button[text()=' Scorecard']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonscorecard);
         //click on to select kpi metric
         let clickonxaxis = By.xpath("(//div[@class='multiselect__tags'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonxaxis);
         //send the kpi metric clicks
         let sendkpimetric = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Avg. Cpc")
         }, sendkpimetric);
         //select the kpi metric
         let selectmetric = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectmetric);
         await driver.sleep(2000);
         let close = By.xpath("//button[@class='ml-1.5']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, close);
       })
       //verify the scorecard with Avg. cpc
       it("verify the scorecard with Avg. cpc", async function () {
         log(':verify the scorecard with Avg. cpc')
         await driver.sleep(2000);
         let actual_avg_cpc_scorecard = await driver.findElement(By.xpath("(//span[@class='text-3xl break-all'])[2]")).getText();
         let expected_avg_cpc_scorecard = item.scorecard_chart[0].verification[0].verify_avg_cpc_scorecard
         assert.equal(expected_avg_cpc_scorecard, actual_avg_cpc_scorecard)
       })
       //create score cart chart for the avg cpc
       it("create bubble chart", async function () {
         log(':create bubble chart')
         //click on add icon
         let clickadd = By.xpath("(//div[@class='v-popper v-popper--theme-dropdown'])[1]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickadd);
         //click on bubble
         let clickonbubble = By.xpath("//button[text()=' Bubble']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonbubble);
         //click on select xaxis
         let clickonxaxis = By.xpath("(//div[@class='multiselect__tags'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonxaxis);
         //send the xaxis name
         let sendcoloumname = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("cost")
         }, sendcoloumname);
         let selectcoloum = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectcoloum);
         //select yaxis
         let clickonyaxis = By.xpath("(//div[@class='multiselect__tags'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonyaxis);
         //send the yaxis name
         let sendcoloumnameyaxis = By.xpath("(//input[@type='text'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("clicks")
         }, sendcoloumnameyaxis);
         let selectcoloumyaxis = By.xpath("(//input[@type='text'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectcoloumyaxis);
         //select bubble
         let clickonbubblecoloum = By.xpath("(//div[@class='multiselect__tags'])[6]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonbubblecoloum);
         //send the click on bubble coloum name
         let sendbubblecoloumname = By.xpath("(//input[@type='text'])[6]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Ad Strength")
         }, sendbubblecoloumname);
         let selectbubblecoloum = By.xpath("(//input[@type='text'])[6]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectbubblecoloum);
         //select bubble size matric
         let clickonbubblecoloumsizematric = By.xpath("(//div[@class='multiselect__tags'])[7]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonbubblecoloumsizematric);
         //send the click on bubble coloum name
         let sendbubblecoloumsizematric = By.xpath("(//input[@type='text'])[7]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("All Conv.")
         }, sendbubblecoloumsizematric);
         let selectbubblecoloumsizematric = By.xpath("(//input[@type='text'])[7]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectbubblecoloumsizematric);
         await driver.sleep(2000);
         let close = By.xpath("//button[@class='ml-1.5']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, close);
       })
       //verify the bubble graph
       it("verify the bubble graph", async function () {
         log(':verify the bubble graph')
         const chartelements = "(//*[local-name()='svg']//*[name()='g' and @transform='translate(54,67) scale(1 1)' ]//*[name()='path' and @stroke-width='1'])"
         let text = "(//div[@class='inline-flex px-3 py-2 text-black flex-col drop-shadow-big font-normal'])[2]"
         for (let m = 1; m <= 3; m++) {
           const elements = await driver.findElements(By.xpath(`${chartelements}[${m}]`));
           await driver.actions().move({
             origin: elements[0]
           }).perform();
           await driver.sleep(1000);
           let test = await driver.findElement(By.xpath(text)).getText();
           console.log("testing", test)
           const lines = test.split('\n');
           const actual_ad_strength = lines[0].replace('Ad Strength: ', '').trim();
           const actual_cost_value = lines[1].replace('Cost: ', '').trim();
           const actual_clicks_value = lines[2].replace('Clicks: ', '').trim();
           const actual_all_conv_value = lines[3].replace('All Conv. Rate:', '').trim();

           for (let n = 0; n < item.bubble_chart[0].verification[0].verify_ad_strength.length; n++) {
             if (actual_cost_value === item.bubble_chart[0].verification[0].verify_cost[n]) {
               console.log("inside the loop")
               await driver.sleep(10);
               //verify all Conv data
               const expected_all_conv_value = item.bubble_chart[0].verification[0].verify_All_conv[n]
               assert.equal(expected_all_conv_value, actual_all_conv_value);
               //verify the click
               const expected_clicks_value = item.bubble_chart[0].verification[0].verify_clicks[n]
               assert.equal(expected_clicks_value, actual_clicks_value);
               //verify conversion
               const expected_cost_value = item.bubble_chart[0].verification[0].verify_cost[n]
               assert.equal(expected_cost_value, actual_cost_value);
               //verify ad strength
               const expected_ad_strength_value = item.bubble_chart[0].verification[0].verify_ad_strength[n]
               assert.equal(expected_ad_strength_value, actual_ad_strength);
               await driver.sleep(20);
               break;
             }
           }
         }
       })
       //create pie chart
       it("create pie chart", async function () {
         log(':create pie chart')
         //click on add icon
         let clickadd = By.xpath("(//div[@class='v-popper v-popper--theme-dropdown'])[1]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickadd);
         //click on pie
         let clickonpie = By.xpath("//button[text()=' Pie']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonpie);
         //click on select coloum
         let clickonxaxis = By.xpath("(//div[@class='multiselect__tags'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonxaxis);
         //send the coloum name
         let sendcoloumname = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Campaign Type")
         }, sendcoloumname);
         let selectcoloum = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectcoloum);
         //send metric name
         let clickonmetric = By.xpath("(//div[@class='multiselect__tags'])[3]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonmetric);
         let sendmetric = By.xpath("(//input[@type='text'])[3]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Cost / All Conv")
         }, sendmetric);
         let selectmetric = By.xpath("(//input[@type='text'])[3]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectmetric);
         await driver.sleep(2000);
         let close = By.xpath("//button[@class='ml-1.5']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, close);
       })
       //verify the pie chart
       it("verify the pie chart", async function () {
         log(':verify the pie chart')
         //click on the video and display option
         let clickvideo = By.xpath("//button[@aria-label='Show VIDEO']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickvideo);
         let clicksearch = By.xpath("//button[@aria-label='Show SEARCH']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clicksearch);
         const chartelements = "(//*[local-name()='svg']//*[name()='g' and @class='highcharts-series highcharts-series-0 highcharts-pie-series highcharts-tracker' ]//*)"
         let text = "(//div[@class='inline-flex px-3 py-2 text-black drop-shadow-big font-normal'])"
         for (let m = 2; m <= 2; m++) {
           const elements = await driver.findElements(By.xpath(`${chartelements}[${m}]`));
           await driver.actions().move({
             origin: elements[0]
           }).perform();
           await driver.sleep(1000);
           let test = await driver.findElement(By.xpath(text)).getText();
           console.log("testing", test)
           const lines = test.split('\n');
           const actual_display_value = lines[3].replace(': ', '').trim();
           console.log("actual_display_value", actual_display_value)
           let expected_display_value = item.pie_chart[0].verification[0].verify_display;
           assert.equal(expected_display_value, actual_display_value);
         }
         //click on the search and display option
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clicksearch);
         let clickdisplayoption = By.xpath("//button[@aria-label='Show DISPLAY']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickdisplayoption);
         for (let m = 2; m <= 2; m++) {
           const elements = await driver.findElements(By.xpath(`${chartelements}[${m}]`));
           await driver.actions().move({
             origin: elements[0]
           }).perform();
           await driver.sleep(1000);
           let test = await driver.findElement(By.xpath(text)).getText();
           console.log("testing", test)
           const lines = test.split('\n');
           const actual_search_value = lines[3].replace(': ', '').trim();
           let expected_search_value = item.pie_chart[0].verification[0].verify_search
           assert.equal(expected_search_value, actual_search_value)
         }
         //click on the search and video option
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickvideo);
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clicksearch);
         for (let m = 2; m <= 2; m++) {
           const elements = await driver.findElements(By.xpath(`${chartelements}[${m}]`));
           await driver.actions().move({
             origin: elements[0]
           }).perform();
           await driver.sleep(1000);
           let test = await driver.findElement(By.xpath(text)).getText();
           console.log("testing", test)
           const lines = test.split('\n');
           const actual_video_value = lines[3].replace(': ', '').trim();
           let expected_video_value = item.pie_chart[0].verification[0].verify_video
           assert.equal(expected_video_value, actual_video_value);
         }
       })
       //create data table chart
       it("create data table chart", async function () {
         log(':create data table chart')
         //click on add icon
         let clickadd = By.xpath("(//div[@class='v-popper v-popper--theme-dropdown'])[1]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickadd);
         //click on the data table
         let clickdatatable = By.xpath("//button[text()=' Data Table']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickdatatable);
         //add coloums date,campaign name and bid strategy
         let clickoncoloum = By.xpath("(//div[@class='multiselect__tags'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickoncoloum);
         //send the coloum date
         let sendcoloumdate = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("date")
         }, sendcoloumdate);
         let selectcoloum = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectcoloum);
         //send the coloum campaign name
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickoncoloum);
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Campaign name")
         }, sendcoloumdate);
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectcoloum);
         //send the bid strategy
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickoncoloum);
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("bid strategy")
         }, sendcoloumdate);
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectcoloum);
         let clickoncoloumtext = By.xpath("(//span[text()='Data Table'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickoncoloumtext);
         //add matrics value 1 conv rate
         let clickonvalue = By.xpath("(//div[@class='multiselect__tags'])[3]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonvalue);
         let sendcoloumname = By.xpath("(//input[@type='text'])[3]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Conv. Rate")
         }, sendcoloumname);
         let selectcoloumconvrate = By.xpath("(//input[@type='text'])[3]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectcoloumconvrate);
         //add value 2 cost/all conv
         let clickonaddvalue = By.xpath("//button[text()=' Add Value']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonaddvalue);
         let clickoncostallconv = By.xpath("(//div[@class='multiselect__tags'])[5]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickoncostallconv);
         let sendcostallconv = By.xpath("(//input[@type='text'])[5]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Cost / All Conv.")
         }, sendcostallconv);
         let selectcostallconv = By.xpath("(//input[@type='text'])[5]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectcostallconv);
         //add value 3 view rate
         let clickonviewrate = By.xpath("(//div[@class='multiselect__tags'])[7]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonviewrate);
         let sendviewrate = By.xpath("(//input[@type='text'])[7]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Cost / All Conv.")
         }, sendviewrate);
         let selectviewrate = By.xpath("(//input[@type='text'])[7]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectviewrate);
         //click on to close pop up
         await driver.sleep(2000);
         let close = By.xpath("//button[@class='ml-1.5']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, close);
       })
       it("verify the table data", async function () {
         log(':verify the table data')
         const rows = await driver.findElements(By.xpath("//table//tr"));
         for (let i = 1; i < rows.length - 3; i++) {
           let test = "(//table//tr/td[1])" + "[" + i + "]";
           let test1 = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(test))), isTimeout).getText();
           console.log("test1", test1);
           let actual_campaign_name = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`//table//tr[${i}]/td[2]`))), isTimeout).getText();
           console.log("actual_campaign_name", actual_campaign_name)
           let actual_bid_strategy = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`//table//tr[${i}]/td[3]`))), isTimeout).getText();
           console.log("actual_bid_strategy", actual_bid_strategy)
           let actual_conv_rate = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`//table//tr[${i}]/td[4]`))), isTimeout).getText();
           console.log("actual_conv_rate", actual_conv_rate)
           let actual_const_all_conv = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`//table//tr[${i}]/td[5]`))), isTimeout).getText();
           console.log("actual_const_all_conv", actual_const_all_conv)
           for (let n = 0; n < item.data_table[0].verification[0].verify_date.length; n++) {
             if (actual_campaign_name === item.data_table[0].verification[0].campaign_name[n]) {
               console.log("inside the loop")
               //verify the campaign name
               let expected_compaign_name = item.data_table[0].verification[0].campaign_name[n]
               console.log("expected_compaign_name", expected_compaign_name)
               assert.equal(expected_compaign_name, actual_campaign_name)
               //verify the bid strategy
               // let expected_bid_strategy = item.data_table[0].verification[0].bid_strategy[n]
               // assert.equal(expected_bid_strategy, actual_bid_strategy)
               //verify the conv rate
               let expected_conv_rate = item.data_table[0].verification[0].conv_rate[n]
               assert.equal(expected_conv_rate, actual_conv_rate)
               //verify the const all conv
               let expected_const_all_conv = item.data_table[0].verification[0].cost_all_conv[n]
               assert.equal(expected_const_all_conv, actual_const_all_conv)
               break;
             }
           }
         }
       })
       //create pivot table
       it("create pivot table", async function () {
         log(':create pivot table')
         //click on add icon
         let clickadd = By.xpath("(//div[@class='v-popper v-popper--theme-dropdown'])[1]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickadd)
         //click on the pivot table
         let clickpivottable = By.xpath("//button[text()=' Pivot Table']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickpivottable);
         //select value 1 date
         let clickonvalue1 = By.xpath("(//div[@class='multiselect__tags'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonvalue1);
         let sendvalue1 = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("date")
         }, sendvalue1);
         let selectvalue1 = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectvalue1);
         //select coloumns impressions
         let clickoncoloums = By.xpath("(//div[@class='multiselect__tags'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickoncoloums);
         let sendcoloumns = By.xpath("(//input[@type='text'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("impressions")
         }, sendcoloumns);
         let selectcoloumns = By.xpath("(//input[@type='text'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectcoloumns);
         //select rows Ad name
         let clickonrows = By.xpath("(//div[@class='multiselect__tags'])[5]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonrows);
         let sendrows = By.xpath("(//input[@type='text'])[5]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Ad Name")
         }, sendrows);
         let selectrows = By.xpath("(//input[@type='text'])[5]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectrows);
         await driver.sleep(2000);
         let close = By.xpath("//button[@class='ml-1.5']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, close);
       })
       //verify the pivot table data
       it("verify the pivot table data", async function () {
         log(':verify the pivot table data')
         const rows = await driver.findElements(By.xpath("(//table)[1]//tr"));
         for (let i = 1; i < rows.length - 1; i++) {
           let test = "(//table//tr/td[1])" + "[" + i + "]";
           let actual_adname_and_impression = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(test))), isTimeout).getText();
           console.log(actual_adname_and_impression);
           let actual_total_value = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`(//table//tr/td[@class='pivot-table__total-column--sticky pivot-table__total-column'])[${i}]`))), isTimeout).getText();
           console.log("actual_total_value", actual_total_value)
           for (let n = 0; n < item.pivot_table[0].verification[0].verify_adname_and_impression.length; n++) {
             if (actual_adname_and_impression === item.pivot_table[0].verification[0].verify_adname_and_impression[n]) {
               console.log("inside the loop")
               //verify the ad name and impression
               let expected_adname_and_impression = item.pivot_table[0].verification[0].verify_adname_and_impression[n]
               assert.equal(expected_adname_and_impression, actual_adname_and_impression)
               //verify the total value
               let expected_total_value = item.pivot_table[0].verification[0].total[n]
               assert.equal(expected_total_value, actual_total_value)
             }
           }
         }
       })
       //create the outliers
       it("create the outliers", async function () {
         log(':create the outliers')
         //click on add icon
         let clickadd = By.xpath("(//div[@class='v-popper v-popper--theme-dropdown'])[1]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickadd)
         //click on the outliers
         let clickoutliers = By.xpath("//button[text()=' Outliers']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickoutliers)
         //select metric of interest ctr
         let clickonmetrics = By.xpath("(//div[@class='multiselect__tags'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonmetrics);
         let sendmetrics = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Ctr")
         }, sendmetrics);
         let selectmetrics = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectmetrics);
         //select influencing coloumns ad type 
         let clickoninfluencecoloum = By.xpath("(//div[@class='multiselect__tags'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickoninfluencecoloum);
         let sendinfluencecoloum = By.xpath("(//input[@type='text'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Ad Type")
         }, sendinfluencecoloum);
         let selectinfluencecoloum = By.xpath("(//input[@type='text'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectinfluencecoloum);
         //select influencing coloumns campaign type
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Campaign Type")
         }, sendinfluencecoloum);
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectinfluencecoloum);
         await driver.sleep(2000);
         let close = By.xpath("//button[@class='ml-1.5']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, close);
       })
       //verify the outliers data
       it("verify the outliers data", async function () {
         log(':verify the outliers data')
         const rows = await driver.findElements(By.xpath("(//table)[3]//tr"));
         for (let i = 1; i < rows.length - 4; i++) {
           let test = "((//table)[3]//tr/td[3])" + "[" + i + "]";
           let actual_ctr_percentage = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(test))), isTimeout).getText();
           console.log(actual_ctr_percentage);
           let actual_ad_type = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`((//table)[3]//tr/td[4])[${i}]`))), isTimeout).getText();
           console.log("actual_ad_type", actual_ad_type)
           let actual_campaign_type = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`((//table)[3]//tr/td[5])[${i}]`))), isTimeout).getText();
           console.log("actual_campaign_type", actual_campaign_type)
           let actual_outlier_percentage = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`((//table)[3]//tr/td[2])[${i}]`))), isTimeout).getText();
           console.log("actual_outlier_percentage", actual_outlier_percentage)
           for (let n = 0; n < item.outilers_table[0].verification[0].verify_ctr_percentage.length; n++) {
             if (actual_ctr_percentage === item.outilers_table[0].verification[0].verify_ctr_percentage[n]) {
               console.log("inside the loop")
               //verify the ctr percentage
               let expected_ctr_percentage = item.outilers_table[0].verification[0].verify_ctr_percentage[n]
               assert.equal(expected_ctr_percentage, actual_ctr_percentage)
               //verify the ad type
               let expected_ad_type = item.outilers_table[0].verification[0].verify_ad_type[n]
               assert.equal(expected_ad_type, actual_ad_type)
               //verify the compaign type
               let expected_compaign_type = item.outilers_table[0].verification[0].verify_compaign_type[n]
               assert.equal(expected_compaign_type, actual_campaign_type)
               let expected_outlier_percentage = item.outilers_table[0].verification[0].verify_outlier_percentage[n]
               assert.equal(expected_outlier_percentage, actual_outlier_percentage)
             }
           }
         }
         const rows1 = await driver.findElements(By.xpath("((//table)[4]//tr/td[@class='!bg-cherry-20 rounded-l border-l-2 text-center text-body-2 border-l-white'])"));
         for (let i = 1; i < rows1.length; i++) {
           let test = "((//table)[4]//tr/td[@class='!bg-cherry-20 rounded-l border-l-2 text-center text-body-2 border-l-white'])" + "[" + i + "]";
           let actual_bottom_outler_percentage = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(test))), isTimeout).getText();
           console.log(actual_bottom_outler_percentage);
           for (let n = 0; n < item.outilers_table[0].verification[0].bottom_outler_percentage.length; n++) {
             if (actual_ctr_percentage === item.outilers_table[0].verification[0].bottom_outler_percentage[n]) {
               let expected_bottom_outler_percentage = item.outilers_table[0].verification[0].verify_ctr_percentage[n]
               assert.equal(expected_bottom_outler_percentage, actual_bottom_outler_percentage)
             }
           }
         }
       })
       //create the roi calculation
       it("create the roi calculator", async function () {
         log(':create the roi calculator')
         //click on add icon
         let clickadd = By.xpath("(//div[@class='v-popper v-popper--theme-dropdown'])[1]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickadd)
         //click on roi calculation
         let clickonroicalculator = By.xpath("//button[text()=' ROI Calculator']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonroicalculator)
         //select maximize impression
         let clickonmetrictomaximize = By.xpath("(//div[@class='multiselect__tags'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonmetrictomaximize);
         let sendmetricmaximize = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Impression")
         }, sendmetricmaximize);
         let selectmatricmaximize = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectmatricmaximize);
         //select metric to minimize cost
         let clickonmetrictominimize = By.xpath("(//div[@class='multiselect__tags'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonmetrictominimize);
         let sendmatricminimize = By.xpath("(//input[@type='text'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Cost")
         }, sendmatricminimize);
         let selectmatricminimize = By.xpath("(//input[@type='text'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectmatricminimize);
         //select the influencing coloumns-ad type 
         let clickoninfluencingcoloumns = By.xpath("(//div[@class='multiselect__tags'])[6]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickoninfluencingcoloumns);
         let sendinfluencing = By.xpath("(//input[@type='text'])[6]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Ad Type")
         }, sendinfluencing);
         let selectinfluencing = By.xpath("(//input[@type='text'])[6]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectinfluencing);
         //select the influencing campaign type
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Campaign Type")
         }, sendinfluencing);
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectinfluencing);
         await driver.sleep(2000);
         let close = By.xpath("//button[@class='ml-1.5']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, close);
       })
       //verify the roi calcular data
       it("verify the roi calcular data", async function () {
         log(':verify the roi calcular data')
         //verify the impressions data
         for (let i = 1; i < 4; i++) {
           let test = "((//table)[2]//tr/td[2])" + "[" + i + "]";
           let actual_impression_value = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(test))), isTimeout).getText();
           console.log(actual_impression_value);
           let actual_cost = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`((//table)[2]//tr/td[4])[${i}]`))), isTimeout).getText();
           console.log("actual_cost", actual_cost);
           let actual_roi_percentage = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`((//table)[2]//tr/td[6])[${i}]`))), isTimeout).getText();
           console.log("actual_roi_percentage", actual_roi_percentage);
           let actual_ad_type = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`((//table)[2]//tr/td[7])[${i}]`))), isTimeout).getText();
           console.log("actual_ad_type", actual_ad_type);
           let actual_campaign_type = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`((//table)[2]//tr/td[8])[${i}]`))), isTimeout).getText();
           console.log("actual_campaign_type", actual_campaign_type);
           let actual_record = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`((//table)[2]//tr/td[9])[${i}]`))), isTimeout).getText();
           console.log("actual_record", actual_record);
           for (let n = 0; n < item.roi_calculator[0].verification[0].verify_impressions.length; n++) {
             if (actual_impression_value === item.roi_calculator[0].verification[0].verify_impressions[n]) {
               console.log("inside the loop")
               //verify the impression value
               let expected_impression_value = item.roi_calculator[0].verification[0].verify_impressions[n]
               assert.equal(expected_impression_value, actual_impression_value)
               //verify the cost data
               let expected_cost = item.roi_calculator[0].verification[0].verify_cost[n]
               assert.equal(expected_cost, actual_cost)
               //verify the roi percentage
               let expected_roi_percentage = item.roi_calculator[0].verification[0].verify_roi_percentage[n]
               assert.equal(expected_roi_percentage, actual_roi_percentage)
               //verify the ad type
               let expected_ad_type = item.roi_calculator[0].verification[0].verify_ad_type[n]
               assert.equal(expected_ad_type, actual_ad_type)
               //verify the compaign type
               let expected_compaign_type = item.roi_calculator[0].verification[0].verify_compaign_type[n]
               assert.equal(expected_compaign_type, actual_campaign_type)
               //verify the records
               let expected_record = item.roi_calculator[0].verification[0].verify_records[n]
               assert.equal(expected_record, actual_record)
             }
           }
         }
         //verify total impressions
         let actual_total_impression_value = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("((//table)[2]//tr/td[2])[7]"))), isTimeout).getText();
         let expected_total_impression_value = item.roi_calculator[0].verification[0].total_impression
         assert.equal(expected_total_impression_value, actual_total_impression_value)
         //verify the total cost
         let actual_total_cost = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//div[@class='border-b border-b-silver-100/40']"))), isTimeout).getText();
         let expected_total_cost = item.roi_calculator[0].verification[0].total_cost
         assert.equal(expected_total_cost, actual_total_cost)
         //verify the total roi percentage
         let actual_total_roi_percentage = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//div[@class='border-b rounded-br border-b-silver-100/40 px-7 border-r text-red-shade-40 border-r-silver-100/40']"))), isTimeout).getText();
         let expected_total_roi_percentage = item.roi_calculator[0].verification[0].total_roi_percentage
         assert.equal(expected_total_roi_percentage, actual_total_roi_percentage)
         //verify the total ad type
         let actual_total_ad_type = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("(//span[@class='inline-flex items-center text-small-1 pb-1.25 pt-1.5 px-2.5'])[7]"))), isTimeout).getText();
         let expected_total_ad_type = item.roi_calculator[0].verification[0].total_ad_type
         assert.equal(expected_total_ad_type, actual_total_ad_type)
         //verify the total compaign type
         let actual_total_campaign_type = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("(//span[@class='inline-flex items-center text-small-1 pb-1.25 pt-1.5 px-2.5'])[8]"))), isTimeout).getText();
         let expected_total_compaign_type = item.roi_calculator[0].verification[0].total_compaign_type
         assert.equal(expected_total_compaign_type, actual_total_campaign_type)
         //verify the total record
         let actual_total_record = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("(//td[@class='text-center text-small-1'])[4]"))), isTimeout).getText();
         let expected_total_record = item.roi_calculator[0].verification[0].total_records
         assert.equal(expected_total_record, actual_total_record)
       })
       //click on data icon to open the pop up
       it("click on data icon to open pop up", async function () {
         log(':click on data icon to open pop up')
         let clickondata = By.xpath("(//div[@class='group-hover/sidebar-btn:bg-silver-40 transition-colors p-2 mb-0.75 mx-auto rounded'])[5]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickondata, 5, 20000);
         // wait until pop up shows up
         await actionWithRetry(driver, async function (element) {}, By.xpath("//div[@class='flex items-center text-sm leading-4 mb-1']"), 4, 3000);
       })
       //verify the rows count,coloum count,date range and coloumns name on the data pop up
       it("verify the details on the data pop up", async function () {
         log(':verify the details on the data pop up')
         await driver.sleep(2000);
         //verify the rows count
         let actual_rows_count = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("(//p[@class='inline-flex text-body-2 items-center'])[1]"))), isTimeout).getText()
         let expected_rows_count = item.data_summary[0].verification[0].rows
         assert.equal(expected_rows_count, actual_rows_count)
         //verify the coloumns count
         let actual_coloumns_count = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("(//p[@class='inline-flex text-body-2 items-center'])[2]"))), isTimeout).getText()
         let expected_coloumns_count = item.data_summary[0].verification[0].coloumns
         assert.equal(expected_coloumns_count, actual_coloumns_count)
         //verify the date range
         let actual_date_range_count = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("(//p[@class='inline-flex text-body-2 items-center'])[3]"))), isTimeout).getText()
         let expected_date_range_count = item.data_summary[0].verification[0].date_range
         assert.equal(expected_date_range_count, actual_date_range_count)
         const rows = await driver.findElements(By.xpath("//span[@class='break-words text-body-2']"));
         for (let i = 1; i < rows.length; i++) {
           let test = "(//span[@class='break-words text-body-2'])" + "[" + i + "]";
           //get the coloumn name from the pop up
           let actual_coloumns = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(test))), isTimeout).getText();
           console.log(actual_coloumns);
           for (let n = 0; n < item.data_summary[0].verification[0].verify_coloumns_name.length; n++) {
             if (actual_coloumns === item.data_summary[0].verification[0].verify_coloumns_name[n]) {
               console.log("inside the loop")
               //verify the coloumns
               let expected_coloumns = item.data_summary[0].verification[0].verify_coloumns_name[n]
               assert.equal(expected_coloumns, actual_coloumns)

             }
           }
         }
       })
       //verify the data types on the summary pop up
       it("verify the data types on the summary pop up", async function () {
         log(':verify the data types on the summary pop up')
         const rows = await driver.findElements(By.xpath("//span[@class='summary__data-type']"));
         for (let i = 1; i < rows.length; i++) {
           //get the data types name from the pop up
           let actual_data_types = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`(//span[@class='summary__data-type'])[${i}]`))), isTimeout).getText();
           console.log("actual_data_types", actual_data_types)
           for (let n = 0; n < item.data_summary[0].verification[0].verify_coloumns_name.length; n++) {
             if (actual_data_types === item.data_summary[0].verification[0].verify_coloums_data_type[n]) {
               console.log("inside the loop")
               //verify the data types
               let expected_data_types = item.data_summary[0].verification[0].verify_coloums_data_type[n]
               assert.equal(expected_data_types, actual_data_types)
             }
           }
         }
       })
       //verify the title on the summary pop up
       it("verify the title on the summary pop up", async function () {
         log(':verify the title on the summary pop up')
         const rows = await driver.findElements(By.xpath("//span[@class='text-small-1 text-grey-100']"));
         for (let i = 2; i < rows.length; i++) {
           //get the title from the pop up
           let actual_title = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`(//span[@class='text-small-1 text-grey-100'])[${i}]`))), isTimeout).getText();
           console.log("actual_title", actual_title)
           for (let n = 0; n < item.data_summary[0].verification[0].verify_coloumns_name.length; n++) {
             if (actual_title === item.data_summary[0].verification[0].verify_title[n]) {
               console.log("inside the loop")
               //verify the title
               let expected_title = item.data_summary[0].verification[0].verify_title[n]
               assert.equal(expected_title, actual_title)
               break;
             }
           }
         }
         log(':closing the pop up')
         await driver.sleep(2000);
         let close = By.xpath("(//*[local-name()='svg']//*[name()='path' and @d='M18.364 18.364a1 1 0 0 0 0-1.414L13.414 12l4.95-4.95a1 1 0 1 0-1.414-1.414L12 10.586l-4.95-4.95A1 1 0 0 0 5.636 7.05l4.95 4.95-4.95 4.95a1 1 0 1 0 1.414 1.414l4.95-4.95 4.95 4.95a1 1 0 0 0 1.414 0Z'])");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, close, 4, 10000);
       })
       //create funnel 
       it("create the funnel", async function () {
         log(':create the funnel')
         //click on add icon
         let clickadd = By.xpath("(//div[@class='v-popper v-popper--theme-dropdown'])[1]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickadd, 4, 10000)
         //click on funnel
         let clickfunnel = By.xpath("//button[text()=' Funnel']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickfunnel)
         //select campaign name
         let clickonvalue1 = By.xpath("(//div[@class='multiselect__tags'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonvalue1);
         let sendvalue1 = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Campaign Name")
         }, sendvalue1);
         let selectvalue1 = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectvalue1);
         //select the operation avg
         let clickonoperation = By.xpath("(//div[@class='multiselect__tags'])[3]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonoperation);
         let sendoperation = By.xpath("(//input[@type='text'])[3]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Avg")
         }, sendoperation);
         let selectoperation = By.xpath("(//input[@type='text'])[3]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectoperation);
         await driver.sleep(2000);
         let close = By.xpath("//button[@class='ml-1.5']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, close);
       })
       //verify the funnel data
       it("verify the funnel data", async function () {
         log(':verify the funnel data')
         const chartelements = "(//*[local-name()='svg']//*[name()='g' and @class='highcharts-series highcharts-series-0 highcharts-funnel-series highcharts-tracker' ]//*)"
         let text = "(//div[@class='inline-flex px-3 py-2 text-black flex-col drop-shadow-big'])"
         for (let m = 1; m <= 1; m++) {
           const elements = await driver.findElements(By.xpath(`${chartelements}[${m}]`));
           await driver.actions().move({
             origin: elements[0]
           }).perform();
           await driver.sleep(1000);
           let test = await driver.findElement(By.xpath(text)).getText();
           console.log("testing", test)
           const lines = test.split('\n');
           //verify the actual campaign
           const actual_campaign_name = lines[0].replace('Campaign Name: ', '').trim();
           const expected_compaign_name = item.verify_funnel[0].verification[0].campaign_name
           assert.equal(expected_compaign_name, actual_campaign_name)
           const actual_percentage = lines[1].replace('Percentage: ', '').trim();
           const expected_percentage = item.verify_funnel[0].verification[0].percentage
           assert.equal(expected_percentage, actual_percentage)
         }
       })
       //add the scatter
       it("add the scatter", async function () {
         log(':add the scatter')
         //click on add icon
         let clickadd = By.xpath("(//div[@class='v-popper v-popper--theme-dropdown'])[1]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickadd, 4, 10000)
         //click on scatter
         let clickfunnel = By.xpath("//button[text()=' Scatter']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickfunnel)
         //select the y-axis view rate
         let clickonyaxis = By.xpath("(//div[@class='multiselect__tags'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonyaxis);
         let sendyaxis = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Device Preference")
         }, sendyaxis);
         let selectyaxis = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectyaxis);
         //select the x-axis conversions
         let clickonxaxis = By.xpath("(//div[@class='multiselect__tags'])[3]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonxaxis);
         let sendxaxis = By.xpath("(//input[@type='text'])[3]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Ad Strength")
         }, sendxaxis);
         let selectxaxis = By.xpath("(//input[@type='text'])[3]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectxaxis);
         //select the slice ctr
         let clickonslice = By.xpath("(//div[@class='multiselect__tags'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonslice);
         let sendslice = By.xpath("(//input[@type='text'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Ctr")
         }, sendslice);
         let selectslice = By.xpath("(//input[@type='text'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectslice);
         await driver.sleep(2000);
         let close = By.xpath("//button[@class='ml-1.5']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, close);
       })
       //verify the scatter data
       it("verify the scatter data", async function () {
         log(':verify the scatter data')
         const chartelements = "(//*[local-name()='svg']//*[name()='g' and @transform='translate(33,120) scale(1 1)' ]//*)"
         let text = "(//div[@class='inline-flex px-3 py-2 text-black flex-col drop-shadow-big font-normal'])[2]"
         for (let m = 8; m <= 11; m++) {
           const elements = await driver.findElements(By.xpath(`${chartelements}[${m}]`));
           await driver.actions().move({
             origin: elements[0]
           }).perform();
           await driver.sleep(1000);
           let test = await driver.findElement(By.xpath(text)).getText();
           console.log("testing", test)
           const lines = test.split('\n');
           const actual_device_preference = lines[0].replace('Device Preference: ', '').trim();
           console.log("actual_device_preference", actual_device_preference)
           const actual_ad_strength = lines[1].replace('Ad Strength: ', '').trim();
           console.log("actual_ad_strength", actual_ad_strength)
           const actual_ctr = lines[2].replace('Ctr: ', '').trim();
           console.log("actual_ctr", actual_ctr)
           for (let n = 0; n < item.verify_scatter[0].verification[0].device_preference.length; n++) {
             if (actual_device_preference === item.verify_scatter[0].verification[0].device_preference[n]) {
               console.log("inside the loop")
               //verify the device preference
               let expected_device_prefrence = item.verify_scatter[0].verification[0].device_preference[n]
               assert.equal(expected_device_prefrence, actual_device_preference)
               //verify the ad strength
               let expected_ad_strength = item.verify_scatter[0].verification[0].ad_strength[n]
               assert.equal(expected_ad_strength, actual_ad_strength)
               //verify the ctr
               let expected_ctr = item.verify_scatter[0].verification[0].ctr[n]
               assert.equal(expected_ctr, actual_ctr)
             }
           }
         }
       })
       //create the grid
       it("create the Grid", async function () {
         log(':create grid')
         //click on add icon
         let clickadd = By.xpath("(//div[@class='v-popper v-popper--theme-dropdown'])[1]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickadd)
         //click on grid
         let clickongrid = By.xpath("//button[text()=' Grid']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickongrid)
         //select the coloumns date
         let clickoncoloumns = By.xpath("(//div[@class='multiselect__tags'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickoncoloumns);
         let sendcoloumnsname = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Date")
         }, sendcoloumnsname);
         let selectcoloumnsname = By.xpath("(//input[@type='text'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectcoloumnsname);
         //select the coloumns campaign name
         let clickoncoloumnscampaign = By.xpath("(//div[@class='multiselect__tags'])[3]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickoncoloumnscampaign);
         let sendcampaignname = By.xpath("(//input[@type='text'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Campaign Name")
         }, sendcampaignname);
         let selectcampaignname = By.xpath("(//input[@type='text'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectcampaignname);
         //select the coloumns clicks
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickoncoloumnscampaign);
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Clicks")
         }, sendcampaignname);
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectcampaignname, 4);
         //select the coloumns avg cpc
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickoncoloumnscampaign);
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Avg. Cpc")
         }, sendcampaignname, 4);
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectcampaignname, 4);
         //select the coloumns cost
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickoncoloumnscampaign);
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Cost")
         }, sendcampaignname, 4);
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectcampaignname, 4);
         await driver.sleep(2000);
         let close = By.xpath("//button[@class='ml-1.5']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, close);
       })
       it("verify the date on the grid table", async function () {
         log(':verify the date on the grid table')
         for (let i = 2; i < 50; i++) {
           let test = "((//table)[3]//tr/td[2])" + "[" + i + "]";
           let actual_date = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(test))), isTimeout).getText();
           console.log("actual_date", actual_date);
           for (let n = 0; n < item.verify_grid[0].verification[0].verify_date.length; n++) {
             if (actual_date === item.verify_grid[0].verification[0].verify_date[n]) {
               console.log("inside the loop")
               //verify the date
               let expected_date = item.verify_grid[0].verification[0].verify_date[n]
               assert.equal(expected_date, actual_date)
               break;
             }
           }
         }
       })
       //verify the campaign name on the grid
       it("verify the campaign name on the grid", async function () {
         log(':verify the campaign name on the grid')
         for (let i = 2; i < 50; i++) {
           let actual_campaign_name = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`((//table)[3]//tr/td[3])[${i}]`))), isTimeout).getText();
           console.log("actual_campaign_name", actual_campaign_name);
           for (let n = 0; n < item.verify_grid[0].verification[0].verify_date.length; n++) {
             if (actual_campaign_name === item.verify_grid[0].verification[0].verify_campaign_name[n]) {
               console.log("inside the loop")
               //verify the campaign name
               let expected_campaign_name = item.verify_grid[0].verification[0].verify_campaign_name[n]
               assert.equal(expected_campaign_name, actual_campaign_name)
               break;
             }
           }
         }
       })
       //verify the click on the grid
       it("verify the click on the grid", async function () {
         log(':verify the click on the grid')
         for (let i = 1; i < 50; i++) {
           let actual_clicks = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`((//table)[3]//tr/td[4])[${i}]`))), isTimeout).getText();
           console.log("actual_clicks", actual_clicks);
           for (let n = 0; n < item.verify_grid[0].verification[0].verify_date.length; n++) {
             if (actual_clicks === item.verify_grid[0].verification[0].verify_clicks[n]) {
               console.log("inside the loop")
               //verify the clicks
               let expected_clicks = item.verify_grid[0].verification[0].verify_clicks[n]
               assert.equal(expected_clicks, actual_clicks)
               break;
             }
           }
         }
       })
       //verify the avg cpc
       it("verify the avg cpc on the grid", async function () {
         log(':verify the avg cpc on the grid')
         for (let i = 2; i < 50; i++) {
           let actual_avg_cpc = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`((//table)[3]//tr/td[5])[${i}]`))), isTimeout).getText();
           console.log("actual_avg_cpc", actual_avg_cpc);
           for (let n = 0; n < item.verify_grid[0].verification[0].verify_date.length; n++) {
             if (actual_avg_cpc === item.verify_grid[0].verification[0].verify_avg_cpc[n]) {
               console.log("inside the loop")
               //verify the avg cpc
               let expected_acg_cpc = item.verify_grid[0].verification[0].verify_avg_cpc[n]
               assert.equal(expected_acg_cpc, actual_avg_cpc)
               break;
             }
           }
         }
       })
       //verify the cost
       it("verify the cost on the grid", async function () {
         log(':verify the cost on the grid')
         for (let i = 2; i < 50; i++) {
           let actual_cost = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`((//table)[3]//tr/td[6])[${i}]`))), isTimeout).getText();
           console.log("actual_cost", actual_cost);
           for (let n = 0; n < item.verify_grid[0].verification[0].verify_date.length; n++) {
             if (actual_cost === item.verify_grid[0].verification[0].verify_cost[n]) {
               console.log("inside the loop")
               //verify the cost
               let expected_cost = item.verify_grid[0].verification[0].verify_cost[n]
               assert.equal(expected_cost, actual_cost)
               break;
             }
           }
         }
       })
       //create the rich text
       it("create the rich text", async function () {
         log(':create the rich text')
         //click on add icon
         let clickadd = By.xpath("(//div[@class='v-popper v-popper--theme-dropdown'])[1]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickadd)
         //click on rich text
         let clickonrichtext = By.xpath("//button[text()=' Rich Text']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonrichtext)
         //send the rich text
         let sendrichtext = By.xpath("(//div[@class='ck ck-editor__main'])//p");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(item.verify_rich_text[0].verification[0].rich_text)
         }, sendrichtext);
         await driver.sleep(2000);
         //click on done
         let clickondone = By.xpath("//button[text()='Done']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickondone);
       })
       //verify the rich text
       it("verify the rich text", async function () {
         log(':verify the rich text')
         await actionWithRetry(driver, async function (element) {}, By.xpath("(//div[@class='ck-content'])//p"), 4, 3000);
         let actual_rich_text = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("(//div[@class='ck-content'])//p"))), isTimeout).getText();
         let expected_rich_text = item.verify_rich_text[0].verification[0].rich_text
         assert.equal(expected_rich_text, actual_rich_text)
       })
       //create the header
       it("create the header", async function () {
         log(':create the header')
         //click on add icon
         let clickadd = By.xpath("(//div[@class='v-popper v-popper--theme-dropdown'])[1]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickadd)
         //click on header
         let clickonheader = By.xpath("//button[text()=' Header']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonheader)
         //clear the header title
         let clearheadertitle = By.xpath("//input[@placeholder='Enter title']");
         await actionWithRetry(driver, async function (element) {
           await element.clear();
         }, clearheadertitle)
         //send the header title
         let sendheadertitle = By.xpath("//input[@placeholder='Enter title']");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(item.verify_header[0].verification[0].header_title);
         }, sendheadertitle)
         //send the header description
         let sendheaderdesc = By.xpath("//textarea[@placeholder='Enter description']");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(item.verify_header[0].verification[0].header_description);
         }, sendheaderdesc)
         await driver.sleep(2000);
         let close = By.xpath("//button[@class='ml-1.5']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, close);
       })
       //verify the header data 
       it("verify the header title and decription", async function () {
         log(':verify the header title and decription')
         await actionWithRetry(driver, async function (element) {}, By.xpath("//h1[@class='font-medium text-5xl w-full block break-words text-center text-white']"), 4, 3000);
         //verify the title
         let actual_header_title = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//h1[@class='font-medium text-5xl w-full block break-words text-center text-white']"))), isTimeout).getText();
         let expected_header_title = item.verify_header[0].verification[0].header_title
         assert.equal(expected_header_title, actual_header_title)
         //verify the header decription
         let actual_header_description = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//p[@class='font-medium text-base leading-5 opacity-80 mt-2 whitespace-pre-wrap break-words block w-full text-center text-white']"))), isTimeout).getText();
         let expected_header_description = item.verify_header[0].verification[0].header_description
         assert.equal(expected_header_description, actual_header_description)
       })


       //crete the heat map table
       it("crete the heat map table", async function () {
         log(':crete the heat map table')
         //click on add icon
         let clickadd = By.xpath("(//div[@class='v-popper v-popper--theme-dropdown'])[1]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickadd)
         //click on the heat map
         let clickheatmap = By.xpath("//button[text()=' Heatmap']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickheatmap);
         //add y axis campaign name
         let clickonyaxis = By.xpath("(//div[@class='multiselect__tags'])[3]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonyaxis);
         let sendyaxis = By.xpath("(//input[@type='text'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Campaign Name")
         }, sendyaxis);
         let selectyaxis = By.xpath("(//input[@type='text'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectyaxis);
         //add the metric avg cpv
         let clickonmetric = By.xpath("(//div[@class='multiselect__tags'])[5]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonmetric);
         let sendmetric = By.xpath("(//input[@type='text'])[6]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Avg. Cpv")
         }, sendmetric);
         let selectmetric = By.xpath("(//input[@type='text'])[6]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectmetric);
         await driver.sleep(2000);
         let close = By.xpath("//button[@class='ml-1.5']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, close);
       })
       it("verify the heat map table data", async function () {
         log(':verify the heat map table data')
         const chartelements = "(//*[local-name()='svg']//*[name()='g' and @class='highcharts-series highcharts-series-0 highcharts-heatmap-series highcharts-color-0 highcharts-tracker' ]//*)"
         let text = "(//div[@class='inline-flex px-3 py-2 text-black flex-col drop-shadow-big font-normal'])[2]"
         for (let m = 1; m <= 13; m++) {
           const elements = await driver.findElements(By.xpath(`${chartelements}[${m}]`));
           await driver.actions().move({
             origin: elements[0]
           }).perform();
           await driver.sleep(100);
           let test = await driver.findElement(By.xpath(text)).getText();
           console.log("testing", test)
           const lines = test.split('\n');
           const actual_campaign_name = lines[0].replace('Campaign Name: ', '').trim();
           const actual_value = lines[2].replace('Value: ', '').trim();
           for (let n = 0; n < item.verify_heat_map[0].verification[0].campaign_name.length; n++) {
             if (actual_campaign_name === item.verify_heat_map[0].verification[0].campaign_name[n]) {
               console.log("inside the loop")
               //verify the campaign name
               let expected_campaign_name = item.verify_heat_map[0].verification[0].campaign_name[n]
               assert.equal(expected_campaign_name, actual_campaign_name)
               //verify the value
               let expected_value = item.verify_heat_map[0].verification[0].value[n]
               assert.equal(expected_value, actual_value)
               break;
             }
           }
         }
       })

       //create gallery
       it("create the gallery", async function () {
         //click on add icon
         let clickadd = By.xpath("(//div[@class='v-popper v-popper--theme-dropdown'])[1]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickadd)
         //click on gallery
         let clickongallery = By.xpath("//button[text()=' Gallery']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickongallery);
         //click on raw
         let clickonraw = By.xpath("//span[text()='Raw']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonraw);
         await driver.sleep(1000);
         //add headline ad name
         let clickonheadline = By.xpath("(//div[@class='multiselect__tags'])[5]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonheadline);
         let sendcampaignname = By.xpath("(//input[@type='text'])[7]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Ad Name")
         }, sendcampaignname);
         let selectcampaignname = By.xpath("(//input[@type='text'])[7]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectcampaignname);
         //add description ad image url
         let clickonadimageurl = By.xpath("(//div[@class='multiselect__tags'])[6]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonadimageurl);
         let sendadimageurl = By.xpath("(//input[@type='text'])[8]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Ad Image Url")
         }, sendadimageurl);
         let selectadimageurl = By.xpath("(//input[@type='text'])[8]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectadimageurl);
         //add link final url
         let clickonfinalurl = By.xpath("(//div[@class='multiselect__tags'])[7]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonfinalurl);
         let sendfinalurl = By.xpath("(//input[@type='text'])[9]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Final Url")
         }, sendfinalurl);
         let selectfinalurl = By.xpath("(//input[@type='text'])[9]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectfinalurl);
         //send text for link
         let sendtextlink = By.xpath("//input[@placeholder='Enter Text for Link']");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("visit on this link")
         }, sendtextlink);
         await driver.sleep(2000);
         let close = By.xpath("//button[@class='ml-1.5']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, close);
       })
       //verify the ad name on gallery 
       it("verify the ad name on gallery", async function () {
         log(':verify the ad name on gallery')
         //verify the ad name
         for (let i = 1; i < 9; i++) {
           let actual_ad_name = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`(//h3[@class='gallery-card__info__title break-words line-clamp-2'])[${i}]`))), isTimeout).getText();
           console.log("actual_ad_name", actual_ad_name);
           for (let n = 0; n < item.verify_gallery[0].verification[0].ad_name.length; n++) {
             if (actual_ad_name === item.verify_gallery[0].verification[0].ad_name[n]) {
               console.log("inside the loop")
               //verify the ad name
               let expected_ad_name = item.verify_gallery[0].verification[0].ad_name[n]
               assert.equal(expected_ad_name, actual_ad_name)
               break;
             }
           }
         }
       })
       //verify the image url on the gallery
       it("verify the image url on the gallery", async function () {
         log(':verify the image url on the gallery')
         for (let i = 1; i < 9; i++) {
           let actual_image_url = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`(//p[@class='gallery-card__info__description break-words line-clamp-3'])[${i}]`))), isTimeout).getText();
           console.log("actual_image_url", actual_image_url);
           for (let n = 0; n < item.verify_gallery[0].verification[0].ad_name.length; n++) {
             if (actual_image_url === item.verify_gallery[0].verification[0].image_url[n]) {
               console.log("inside the loop")
               //verify the image url
               let expected_image_url = item.verify_gallery[0].verification[0].image_url[n]
               assert.equal(expected_image_url, actual_image_url)
               break;
             }
           }
         }
       })
       //verify the textforlink
       it("verify the text for link on gallery", async function () {
         log(':verify the text for link on gallery')
         for (let i = 1; i < 9; i++) {
           let actual_textforlink = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`(//a[@rel='noopener noreferrer'])[${i}]`))), isTimeout).getText();
           console.log("actual_textforlink", actual_textforlink);
           for (let n = 0; n < item.verify_gallery[0].verification[0].ad_name.length; n++) {
             if (actual_textforlink === item.verify_gallery[0].verification[0].text_for_link[n]) {
               console.log("inside the loop")
               //verify the text for link
               let expected_text_forlink = item.verify_gallery[0].verification[0].text_for_link[n]
               assert.equal(expected_text_forlink, actual_textforlink)
               break;
             }
           }
         }
       })
       //create the correlation
       it("create the correlation", async function () {
         log(':create the correlation')
         //click on add icon
         let clickadd = By.xpath("(//div[@class='v-popper v-popper--theme-dropdown'])[1]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickadd)
         //click on correlation
         let clickcorrelation = By.xpath("//button[text()=' Correlation']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickcorrelation)
         //select all conv. rate
         let clickonmetricofinterest = By.xpath("(//div[@class='multiselect__tags'])[4]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonmetricofinterest);
         let sendmetricofinterest = By.xpath("(//input[@type='text'])[6]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("All Conv. Rate")
         }, sendmetricofinterest);
         let selectmatricofinterest = By.xpath("(//input[@type='text'])[6]");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectmatricofinterest);
         //select conv. rate
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonmetricofinterest);
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Conv. Rate")
         }, sendmetricofinterest);
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectmatricofinterest);
         //select ad strength
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonmetricofinterest);
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Ad Strength")
         }, sendmetricofinterest);
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectmatricofinterest);
         //select conversions
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonmetricofinterest);
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Conversion")
         }, sendmetricofinterest);
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectmatricofinterest);
         //select cost / All Conv.
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonmetricofinterest);
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Cost / ALl Conv.")
         }, sendmetricofinterest);
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectmatricofinterest);
         //slect Ctr
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonmetricofinterest);
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys("Ctr")
         }, sendmetricofinterest);
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(Key.ENTER)
         }, selectmatricofinterest);
         await driver.sleep(2000);
         let close = By.xpath("//button[@class='ml-1.5']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, close);
       })
       //verify the correlation data
       it("verify the correlation data", async function () {
         log(':verify the correlation data')
         const correlationdata = "(//td[@class='text-center']//div)";
         let text = "(//span[@class='mr-1 text-body-1'])"
         for (let i = 1; i < 15; i++) {
           const elements = await driver.findElements(By.xpath(`${correlationdata}[${i}]`));
           await driver.actions().move({
             origin: elements[0]
           }).perform();
           await driver.sleep(1000);
           //get the possitive correlation
           let actual_positive_correlation = await driver.findElement(By.xpath(text)).getText();
           console.log("actual_positive_correlation", actual_positive_correlation)
           for (let n = 0; n < item.verify_correlations[0].verification[0].positive_correlation; n++) {
             if (actual_positive_correlation === item.verify_correlations[0].verification[0].positive_correlation[n]) {
               console.log("inside the loop")
               //verify the date
               let expected_positive_correlation = item.verify_correlations[0].verification[0].positive_correlation[n]
               assert.equal(expected_positive_correlation, actual_positive_correlation)
               break;
             }
           }
         }
       })
       it("create loom", async function () {
         log(':create loom')
         //click on add icon
         let clickadd = By.xpath("(//div[@class='v-popper v-popper--theme-dropdown'])[1]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickadd)
         //click on loom
         let clickonloom = By.xpath("//button[text()=' Loom']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonloom)
         //send the loom url
         let sendloomurl = By.xpath("//input[@placeholder='Insert Loom URL']");
         await actionWithRetry(driver, async function (element) {
           await element.sendKeys(loom_url)
         }, sendloomurl)
         await driver.sleep(2000);
         let close = By.xpath("//button[@class='ml-1.5']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, close);
       })
      
    //go to the main workspace
    it("go to the main workspace", async function () {
      log(':go to the main workspace')
      let clickonlogo = By.xpath("//img[@alt='Polymer logo']");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, clickonlogo);
    })
   
    //select daily totals overview ga4 report
    it("select daily totals overview ga4 report", async function () {
      log(':select daily totals overview ga4 report')
      //click on data manager icon
      let clickicon = By.xpath("(//button[@class='btn polymer-navbar-link'])[1]");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, clickicon, 4, 2000);
      //click on add data
      let adddata = By.xpath("(//span[text()=' Add Data '])[2]");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, adddata, 4, 2000);
      //click on the daily data overview
      let clickondailydataoverview = By.xpath("(//div[@class='polymer-checkbox mb-2'])[1]");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, clickondailydataoverview, 4, 2000);
      //click on next 
      let clickonnext = By.xpath("//span[text()='Next']");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, clickonnext, 4, 2000);
      //select the 90 days 
      let clickondropdown = By.xpath("//button[@class='btn-lg btn-white btn group/btn dropdown']");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, clickondropdown, 4, 2000);
      let clickonninetydays = By.xpath("//li[text()='Last 90 days']");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, clickonninetydays, 4, 2000);
      //click on finish
      let clickonfinish = By.xpath("//span[text()='Finish']");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, clickonfinish, 4, 2000);
    })
    //click on details to show the daily data overview details report
    it("click on details to show the daily data overview details report", async function () {
      log(':click on details to show the daily data overview details report')
      let clickondetails = By.xpath("(//button[text()=' Details '])[3]");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, clickondetails, 4, 2000);
      await actionWithRetry(driver, async function (element) {}, By.xpath("//div[@class='flex items-center text-sm leading-4 mb-1']"), 4, 3000);
    })
    //verify the coloumn name daily data overview details report
    it("verify the coloumn name on daily data overview details report", async function () {
      await driver.sleep(6000);
      const rows = await driver.findElements(By.xpath("//span[@class='break-words text-body-2']"));
      for (let i = 1; i < rows.length; i++) {
        let test = "(//span[@class='break-words text-body-2'])" + "[" + i + "]";
        //get the coloumn name from the pop up
        let actual_coloumns = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(test))), isTimeout).getText();
        console.log("test", actual_coloumns);
        for (let n = 0; n < item.daily_data_overview_ga4_report[0].verification[0].coloum_name.length; n++) {
          if (actual_coloumns === item.daily_data_overview_ga4_report[0].verification[0].coloum_name[n]) {
            console.log("inside the loop")
            //verify the coloumns
            let expected_coloumns = item.daily_data_overview_ga4_report[0].verification[0].coloum_name[n]
            assert.equal(expected_coloumns, actual_coloumns)
            break;
          }
        }
      }
    })
    //verify the data types on daily data overview details report
    it("verify the data types on daily data overview details report", async function () {
      log(':verify the data types on daily data overview details report')
      const rows = await driver.findElements(By.xpath("//span[@class='summary__data-type']"));
      for (let i = 1; i < rows.length; i++) {
        //get the data types name from the pop up
        let actual_data_types = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`(//span[@class='summary__data-type'])[${i}]`))), isTimeout).getText();
        console.log("actual_data_types", actual_data_types)
        for (let n = 0; n < item.daily_data_overview_ga4_report[0].verification[0].data_type.length; n++) {
          if (actual_data_types === item.daily_data_overview_ga4_report[0].verification[0].data_type[n]) {
            console.log("inside the loop")
            //verify the data types
            let expected_data_types = item.daily_data_overview_ga4_report[0].verification[0].data_type[n]
            assert.equal(expected_data_types, actual_data_types)
            break;
          }
        }
      }
    })
    //verify the title on daily data overview details report
    it("verify the title on daily data overview details report", async function () {
      log(':verify the title on daily data overview details report')
      const rows = await driver.findElements(By.xpath("//span[@class='text-small-1 text-grey-100']"));
      for (let i = 8; i < rows.length; i++) {
        //get the title from the pop up
        let actual_title = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`(//span[@class='text-small-1 text-grey-100'])[${i}]`))), isTimeout).getText();
        console.log("actual_title", actual_title)
        for (let n = 0; n < item.daily_data_overview_ga4_report[0].verification[0].title.length; n++) {
          if (actual_title === item.daily_data_overview_ga4_report[0].verification[0].title[n]) {
            console.log("inside the loop")
            //verify the title
            let expected_title = item.daily_data_overview_ga4_report[0].verification[0].title[n]
            assert.equal(expected_title, actual_title)
            break;
          }
        }
      }
      log(':closing the pop up')
      await driver.sleep(2000);
      let close = By.xpath("(//*[local-name()='svg']//*[name()='path' and @d='M18.364 18.364a1 1 0 0 0 0-1.414L13.414 12l4.95-4.95a1 1 0 1 0-1.414-1.414L12 10.586l-4.95-4.95A1 1 0 0 0 5.636 7.05l4.95 4.95-4.95 4.95a1 1 0 1 0 1.414 1.414l4.95-4.95 4.95 4.95a1 1 0 0 0 1.414 0Z'])");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, close, 4, 10000);
    })
    //click on add data icon and select the Acquisition - Overview report
    /*   it("click on add data icon and select the Acquisition - Overview report", async function () {
         log(':click on add data icon and select the Acquisition - Overview report')
         //click on add data
         let adddata = By.xpath("(//span[text()=' Add Data '])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, adddata, 4, 2000);
         //click on the daily data overview
         let clickondailydataoverview = By.xpath("(//div[@class='polymer-checkbox mb-2'])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickondailydataoverview, 4, 2000);
         //click on next 
         let clickonnext = By.xpath("//span[text()='Next']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonnext, 4, 2000);
         //select the 90 days 
         let clickondropdown = By.xpath("//button[@class='btn-lg btn-white btn group/btn dropdown']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickondropdown, 4, 2000);
         let clickonninetydays = By.xpath("//li[text()='Last 90 days']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonninetydays, 4, 2000);
         //click on finish
         let clickonfinish = By.xpath("//span[text()='Finish']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonfinish, 4, 2000);
       })
       //click on details to shown Acquisition - Overview report
       it("click on details to shown Acquisition - Overview report", async function () {
         log(':click on details to shown Acquisition - Overview report')
         await driver.sleep(16000);
         let clickondetails = By.xpath("(//button[text()=' Details '])[3]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickondetails, 35, 2000);
         await actionWithRetry(driver, async function (element) {}, By.xpath("//div[@class='flex items-center text-sm leading-4 mb-1']"), 4, 3000);
       })

       it("verify the coloumn name on Acquisition - Overview report", async function () {
         await driver.sleep(4000);
         const rows = await driver.findElements(By.xpath("//span[@class='break-words text-body-2']"));
         for (let i = 1; i < rows.length; i++) {
           let test = "(//span[@class='break-words text-body-2'])" + "[" + i + "]";
           //get the coloumn name from the pop up
           let actual_coloumns = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(test))), isTimeout).getText();
           console.log("test", actual_coloumns);
           for (let n = 0; n < item.verify_acquisition_overview_report[0].verification[0].coloum_name.length; n++) {
             if (actual_coloumns === item.verify_acquisition_overview_report[0].verification[0].coloum_name[n]) {
               console.log("inside the loop")
               //verify the coloumns
               let expected_coloumns = item.verify_acquisition_overview_report[0].verification[0].coloum_name[n]
               assert.equal(expected_coloumns, actual_coloumns)
               break;
             }
           }
         }
       })
       //verify the data types on Acquisition - Overview report
       it("verify the data types on Acquisition - Overview report", async function () {
         log(':verify the data types on Acquisition - Overview report')
         const rows = await driver.findElements(By.xpath("//span[@class='summary__data-type']"));
         for (let i = 1; i < rows.length; i++) {
           //get the data types name from the pop up
           let actual_data_types = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`(//span[@class='summary__data-type'])[${i}]`))), isTimeout).getText();
           console.log("actual_data_types", actual_data_types)
           for (let n = 0; n < item.verify_acquisition_overview_report[0].verification[0].data_type.length; n++) {
             if (actual_data_types === item.verify_acquisition_overview_report[0].verification[0].data_type[n]) {
               console.log("inside the loop")
               //verify the data types
               let expected_data_types = item.verify_acquisition_overview_report[0].verification[0].data_type[n]
               assert.equal(expected_data_types, actual_data_types)
               break;
             }
           }
         }
       })
       //verify the title on Acquisition - Overview report
       it("verify the title on Acquisition - Overview report", async function () {
         log(':verify the title on Acquisition - Overview report')
         const rows = await driver.findElements(By.xpath("//span[@class='text-small-1 text-grey-100']"));
         for (let i = 9; i < rows.length; i++) {
           //get the title from the pop up
           let actual_title = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`(//span[@class='text-small-1 text-grey-100'])[${i}]`))), isTimeout).getText();
           console.log("actual_title", actual_title)
           for (let n = 0; n < item.verify_acquisition_overview_report[0].verification[0].title.length; n++) {
             if (actual_title === item.verify_acquisition_overview_report[0].verification[0].title[n]) {
               console.log("inside the loop")
               //verify the title
               let expected_title = item.verify_acquisition_overview_report[0].verification[0].title[n]
               assert.equal(expected_title, actual_title)
               break;
             }
           }
         }
         log(':closing the pop up')
         await driver.sleep(2000);
         let close = By.xpath("(//*[local-name()='svg']//*[name()='path' and @d='M18.364 18.364a1 1 0 0 0 0-1.414L13.414 12l4.95-4.95a1 1 0 1 0-1.414-1.414L12 10.586l-4.95-4.95A1 1 0 0 0 5.636 7.05l4.95 4.95-4.95 4.95a1 1 0 1 0 1.414 1.414l4.95-4.95 4.95 4.95a1 1 0 0 0 1.414 0Z'])");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, close, 4, 10000);
       })

       //click on add data icon and select the Behavior - Landing Page + All Pages report
       it("click on add data icon and select the Behavior - Landing Page + All Pages report", async function () {
         log(':click on add data icon and select the Behavior - Landing Page + All Pages report')
         //click on add data
         let adddata = By.xpath("(//span[text()=' Add Data '])[2]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, adddata, 4, 2000);
         //click on the Behavior - Landing Page + All Pages
         let clickondailydataoverview = By.xpath("(//div[@class='polymer-checkbox mb-2'])[3]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickondailydataoverview, 4, 2000);
         //click on next 
         let clickonnext = By.xpath("//span[text()='Next']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonnext, 4, 2000);
         //select the 90 days 
         let clickondropdown = By.xpath("//button[@class='btn-lg btn-white btn group/btn dropdown']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickondropdown, 4, 2000);
         let clickonninetydays = By.xpath("//li[text()='Last 90 days']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonninetydays, 4, 2000);
         //click on finish
         let clickonfinish = By.xpath("//span[text()='Finish']");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickonfinish, 4, 2000);
       })
       //click on details to shown Behavior - Landing Page + All Pages report
       it("click on details to shown Behavior - Landing Page + All Pages report", async function () {
         log(':click on details to shown Behavior - Landing Page + All Pages report')
         await driver.sleep(11000);
         let clickondetails = By.xpath("(//button[text()=' Details '])[3]");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, clickondetails, 60, 2000);
         await actionWithRetry(driver, async function (element) {}, By.xpath("//div[@class='flex items-center text-sm leading-4 mb-1']"), 4, 3000);
       })
       //verify the coloumn name on Acquisition - Overview report
       it("verify the coloumn name on Acquisition - Overview report", async function () {
         await driver.sleep(4000);
         const rows = await driver.findElements(By.xpath("//span[@class='break-words text-body-2']"));
         for (let i = 1; i < rows.length; i++) {
           let test = "(//span[@class='break-words text-body-2'])" + "[" + i + "]";
           //get the coloumn name from the pop up
           let actual_coloumns = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(test))), isTimeout).getText();
           console.log("test", actual_coloumns);
           for (let n = 0; n < item.verify_behaviour_landing_report[0].verification[0].coloum_name.length; n++) {
             if (actual_coloumns === item.verify_behaviour_landing_report[0].verification[0].coloum_name[n]) {
               console.log("inside the loop")
               //verify the coloumns
               let expected_coloumns = item.verify_behaviour_landing_report[0].verification[0].coloum_name[n]
               assert.equal(expected_coloumns, actual_coloumns)
               break;
             }
           }
         }
       })
       //verify the data types on Behavior - Landing Page + All Pages report
       it("verify the data types on Behavior - Landing Page + All Pages report", async function () {
         log(':verify the data types on Acquisition - Overview report')
         const rows = await driver.findElements(By.xpath("//span[@class='summary__data-type']"));
         for (let i = 1; i < rows.length; i++) {
           //get the data types name from the pop up
           let actual_data_types = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`(//span[@class='summary__data-type'])[${i}]`))), isTimeout).getText();
           console.log("actual_data_types", actual_data_types)
           for (let n = 0; n < item.verify_behaviour_landing_report[0].verification[0].data_type.length; n++) {
             if (actual_data_types === item.verify_behaviour_landing_report[0].verification[0].data_type[n]) {
               console.log("inside the loop")
               //verify the data types
               let expected_data_types = item.verify_behaviour_landing_report[0].verification[0].data_type[n]
               assert.equal(expected_data_types, actual_data_types)
               break;
             }
           }
         }
       })
       //verify the title on Behavior - Landing Page + All Pages report
       it("verify the title on Behavior - Landing Page + All Pages report", async function () {
         log(':verify the title on Acquisition - Overview report')
         const rows = await driver.findElements(By.xpath("//span[@class='text-small-1 text-grey-100']"));
         for (let i = 9; i < rows.length; i++) {
           //get the title from the pop up
           let actual_title = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`(//span[@class='text-small-1 text-grey-100'])[${i}]`))), isTimeout).getText();
           console.log("actual_title", actual_title)
           for (let n = 0; n < item.verify_behaviour_landing_report[0].verification[0].title.length; n++) {
             if (actual_title === item.verify_behaviour_landing_report[0].verification[0].title[n]) {
               console.log("inside the loop")
               //verify the title
               let expected_title = item.verify_behaviour_landing_report[0].verification[0].title[n]
               assert.equal(expected_title, actual_title)
               break;
             }
           }
         }
         log(':closing the pop up')
         await driver.sleep(2000);
         let close = By.xpath("(//*[local-name()='svg']//*[name()='path' and @d='M18.364 18.364a1 1 0 0 0 0-1.414L13.414 12l4.95-4.95a1 1 0 1 0-1.414-1.414L12 10.586l-4.95-4.95A1 1 0 0 0 5.636 7.05l4.95 4.95-4.95 4.95a1 1 0 1 0 1.414 1.414l4.95-4.95 4.95 4.95a1 1 0 0 0 1.414 0Z'])");
         await actionWithRetry(driver, async function (element) {
           await element.click();
         }, close, 4, 10000);
       })
      
    //click on add data icon and select the Google Ads - Campaign & Keyword
    it("click on add data icon and select the Google Ads - Campaign & Keyword", async function () {
      log(':click on add data icon and select the Google Ads - Campaign & Keyword')
      //click on add data
      let adddata = By.xpath("(//span[text()=' Add Data '])[2]");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, adddata, 4, 2000);
      //click on the Google Ads - Campaign & Keyword
      let clickondailydataoverview = By.xpath("(//div[@class='polymer-checkbox mb-2'])[4]");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, clickondailydataoverview, 4, 2000);
      //click on next 
      let clickonnext = By.xpath("//span[text()='Next']");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, clickonnext, 4, 2000);
      //select the 90 days 
      let clickondropdown = By.xpath("//button[@class='btn-lg btn-white btn group/btn dropdown']");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, clickondropdown, 4, 2000);
      let clickonninetydays = By.xpath("//li[text()='Last 90 days']");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, clickonninetydays, 4, 2000);
      //click on finish
      let clickonfinish = By.xpath("//span[text()='Finish']");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, clickonfinish, 4, 2000);
    })
    //click on details to shown Google Ads - Campaign & Keyword report
    it("click on details to shown Google Ads - Campaign & Keyword report", async function () {
      log(':click on details to shown Google Ads - Campaign & Keyword report')
      await driver.sleep(11000);
      let clickondetails = By.xpath("(//button[text()=' Details '])[3]");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, clickondetails, 60, 2000);
      await actionWithRetry(driver, async function (element) {}, By.xpath("//div[@class='flex items-center text-sm leading-4 mb-1']"), 4, 3000);
    })
    //verify the coloumn name on Google Ads - Campaign & Keyword report
    it("verify the coloumn name on Google Ads - Campaign & Keyword report", async function () {
      log(':verify the coloumn name on Google Ads - Campaign & Keyword report')
      await driver.sleep(4000);
      const rows = await driver.findElements(By.xpath("//span[@class='break-words text-body-2']"));
      for (let i = 1; i < rows.length; i++) {
        let test = "(//span[@class='break-words text-body-2'])" + "[" + i + "]";
        //get the coloumn name from the pop up
        let actual_coloumns = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(test))), isTimeout).getText();
        console.log(actual_coloumns);
        for (let n = 0; n < item.verify_behaviour_landing_report[0].verification[0].coloum_name.length; n++) {
          if (actual_coloumns === item.verify_google_ads_comapaign_keyword_report[0].verification[0].coloum_name[n]) {
            console.log("inside the loop")
            //verify the coloumns
            let expected_coloumns = item.verify_google_ads_comapaign_keyword_report[0].verification[0].coloum_name[n]
            assert.equal(expected_coloumns, actual_coloumns)
            break;
          }
        }
      }
    })
    //verify the data types on Google Ads - Campaign & Keyword report
    it("verify the data types on Google Ads - Campaign & Keyword report", async function () {
      log(':verify the data types on Google Ads - Campaign & Keyword report')
      const rows = await driver.findElements(By.xpath("//span[@class='summary__data-type']"));
      for (let i = 1; i < rows.length; i++) {
        //get the data types name from the pop up
        let actual_data_types = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`(//span[@class='summary__data-type'])[${i}]`))), isTimeout).getText();
        console.log(actual_data_types)
        for (let n = 0; n < item.verify_google_ads_comapaign_keyword_report[0].verification[0].data_type.length; n++) {
          if (actual_data_types === item.verify_google_ads_comapaign_keyword_report[0].verification[0].data_type[n]) {
            console.log("inside the loop")
            //verify the data types
            let expected_data_types = item.verify_google_ads_comapaign_keyword_report[0].verification[0].data_type[n]
            assert.equal(expected_data_types, actual_data_types)
            break;
          }
        }
      }
    })
    //verify the title on Google Ads - Campaign & Keyword report
    it("verify the title on Google Ads - Campaign & Keyword report", async function () {
      log(':verify the title on Acquisition - Overview report')
      const rows = await driver.findElements(By.xpath("//span[@class='text-small-1 text-grey-100']"));
      for (let i = 9; i < rows.length; i++) {
        //get the title from the pop up
        let actual_title = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`(//span[@class='text-small-1 text-grey-100'])[${i}]`))), isTimeout).getText();
        console.log(actual_title)
        for (let n = 0; n < item.verify_google_ads_comapaign_keyword_report[0].verification[0].title.length; n++) {
          if (actual_title === item.verify_google_ads_comapaign_keyword_report[0].verification[0].title[n]) {
            console.log("inside the loop")
            //verify the title
            let expected_title = item.verify_google_ads_comapaign_keyword_report[0].verification[0].title[n]
            assert.equal(expected_title, actual_title)
            break;
          }
        }
      }
      log(':closing the pop up')
      await driver.sleep(2000);
      let close = By.xpath("(//*[local-name()='svg']//*[name()='path' and @d='M18.364 18.364a1 1 0 0 0 0-1.414L13.414 12l4.95-4.95a1 1 0 1 0-1.414-1.414L12 10.586l-4.95-4.95A1 1 0 0 0 5.636 7.05l4.95 4.95-4.95 4.95a1 1 0 1 0 1.414 1.414l4.95-4.95 4.95 4.95a1 1 0 0 0 1.414 0Z'])");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, close, 4, 10000);
    })
    //click on add data icon and select the Google Ads - Search Queries
    it("click on add data icon and select the Google Ads - Search Queries", async function () {
      log(':click on add data icon and select the Google Ads - Search Queries')
      //click on add data
      let adddata = By.xpath("(//span[text()=' Add Data '])[2]");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, adddata, 4, 2000);
      //click on the Google Ads - Search Queries
      let clickondailydataoverview = By.xpath("(//div[@class='polymer-checkbox mb-2'])[5]");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, clickondailydataoverview, 4, 2000);
      //click on next 
      let clickonnext = By.xpath("//span[text()='Next']");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, clickonnext, 4, 2000);
      //select the 90 days 
      let clickondropdown = By.xpath("//button[@class='btn-lg btn-white btn group/btn dropdown']");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, clickondropdown, 4, 2000);
      let clickonninetydays = By.xpath("//li[text()='Last 90 days']");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, clickonninetydays, 4, 2000);
      //click on finish
      let clickonfinish = By.xpath("//span[text()='Finish']");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, clickonfinish, 4, 2000);
    })
    //click on details to shown Google Ads - Search Queries report
    it("click on details to shown Google Ads - Search Queries report", async function () {
      log(':click on details to shown Google Ads - Search Queries report')
      await driver.sleep(11000);
      let clickondetails = By.xpath("(//button[text()=' Details '])[3]");
      await actionWithRetry(driver, async function (element) {
        await element.click();
      }, clickondetails, 60, 2000);
      await actionWithRetry(driver, async function (element) {}, By.xpath("//div[@class='flex items-center text-sm leading-4 mb-1']"), 4, 3000);
    })
    //verify the coloumn name on Google Ads - Search Queries report
    it("verify the coloumn name on Google Ads - Search Queries report", async function () {
      log(':verify the coloumn name on Google Ads - Search Queries report')
      await driver.sleep(4000);
      const rows = await driver.findElements(By.xpath("//span[@class='break-words text-body-2']"));
      for (let i = 1; i < rows.length; i++) {
        let test = "(//span[@class='break-words text-body-2'])" + "[" + i + "]";
        //get the coloumn name from the pop up
        let actual_coloumns = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(test))), isTimeout).getText();
        console.log(actual_coloumns);
        for (let n = 0; n < item.verify_google_ads_search_queries_report[0].verification[0].coloum_name.length; n++) {
          if (actual_coloumns === item.verify_google_ads_search_queries_report[0].verification[0].coloum_name[n]) {
            console.log("inside the loop")
            //verify the coloumns
            let expected_coloumns = item.verify_google_ads_search_queries_report[0].verification[0].coloum_name[n]
            assert.equal(expected_coloumns, actual_coloumns)
            break;
          }
        }
      }
    })
    //verify the data types on Google Ads - Search Queries report
    it("verify the data types on Google Ads - Search Queries report", async function () {
      log(':verify the data types on Google Ads - Search Queries report')
      const rows = await driver.findElements(By.xpath("//span[@class='summary__data-type']"));
      for (let i = 1; i < rows.length; i++) {
        //get the data types name from the pop up
        let actual_data_types = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(`(//span[@class='summary__data-type'])[${i}]`))), isTimeout).getText();
        console.log(actual_data_types)
        // for (let n = 0; n < item.verify_google_ads_comapaign_keyword_report[0].verification[0].data_type.length; n++) {
        //   if (actual_data_types === item.verify_google_ads_comapaign_keyword_report[0].verification[0].data_type[n]) {
        //     console.log("inside the loop")
        //     //verify the data types
        //     let expected_data_types = item.verify_google_ads_comapaign_keyword_report[0].verification[0].data_type[n]
        //     assert.equal(expected_data_types, actual_data_types)
        //     break;
        //   }
        // }
      }
    })

    /* 
     //Share the board publically and log out
     it("Share the board publically and log out", async function () {
       //click on share button
       await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//button[text()=' Share ']"))), isTimeout).click();
       //access the public access
       await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//label[@class='cursor-pointer polymer-toggle relative inline-flex items-center']"))), isTimeout).click();
       //copy board link
       await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//button[text()=' Copy Board Link']"))), isTimeout).click();
       let getdata = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("(//input[@class='input'])"))), isTimeout).getAttribute('value')
       await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("(//div[@class='polymer-user-avatar'])[1]"))), isTimeout).click();
       await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//a[text()=' Log out']"))), isTimeout).click();
       await driver.get(getdata)
       log(':step 8f - completed getdata for board link')
     })
     //verify the board can be accessed publically
     it("verify the board can be accessed publically", async function () {
       await actionWithRetry(driver, async function (element) {}, By.xpath("//button[text()='Log In']"), 2, 1000);
       log(':step 9')
       log(':step 30 - page loaded')
       let actual_text = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//span[@class='break-all line-clamp-2']"))), isTimeout).getText();
       // verify this string to make sure that board was opened
       let expected_text = "Sum of All conv. rate by Date"
       assert.equal(expected_text, actual_text)
     })
    */
  })
})