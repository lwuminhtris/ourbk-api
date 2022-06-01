// const puppeteer = require("puppeteer");
import puppeteer from "puppeteer";
import { createRequire } from "module";
const requires = createRequire(import.meta.url);
const utils = requires("./utils.json");

export default async function query(username, password, actionType) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 430 });
    await page.goto(utils.login_url);

    await page.focus(utils.username_sel);
    // -> input username here
    await page.keyboard.type(username);

    await page.focus(utils.password_sel);
    // -> input password here
    await page.keyboard.type(password);

    // -> click button
    await page.$eval(utils.login_sel, (form) => form.click());

    // -> redirect
    await page.goto(utils.mybk_url);
    const _token = await page.evaluate(() =>
        document.querySelector("head > meta:nth-child(4)").getAttribute("content")
    );

    await page.setRequestInterception(true);

    page.once("request", (request) => {
        request.continue({
            method: "POST",
        });
    });

    if (actionType === "hoc") {
        // -> request lich hoc
        await page.goto(utils.schedule_table + "?_token=" + _token);
    } else if (actionType === "thi") {
        // -> request lich thi
        await page.goto(utils.exam_table + "?_token=" + _token);
    } else if (actionType === "diem") {
        // -> request bang diem
        await page.goto(utils.grade + "?_token=" + _token);
    }

    const content = await page.evaluate(() => {
        const result = document.querySelector("body > pre").innerHTML;
        if (result !== null) {
            return result;
        } else {
            return {
                status: "failed",
            };
        }
    });

    return content;
    // await page.screenshot({ path: "haha.png" });
    await browser.close();
}
