const puppeteer = require("puppeteer");
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');

const PAGE_URL = "https://www.hansimmo.be/commercieel-gebouw-te-koop-in-deurne/10550";

const main = async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(PAGE_URL);

	const results = await page.evaluate(() => {
		const description = document.querySelector('#description').innerText;
		const title = document.querySelector('#detail-description-container').querySelector('h2').innerText;
		const price = document.querySelector('.price').innerText;
		const address = document.querySelector('.address').innerText;
		return ({
			description,
			title,
			price,
			address,
		})
	});
	console.log(results);
	browser.close();
	return results
};

main().then((data) => {
	cleanText = sanitizeHtml(data.description);
	fs.writeFileSync('info.json', JSON.stringify({...data,description:cleanText}, null, 4))
});