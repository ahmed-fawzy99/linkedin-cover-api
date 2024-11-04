const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const {writeFileSync} = require("node:fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Endpoint to generate the LinkedIn cover screenshot
app.post('/get-linkedin-cover', async (req, res) => {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'An array of items is required.' });
    }

    // Populate the HTML template with vacancies
    const vacanciesHTML = items.map(item => `
        <div class="vacancy">
            ${item.title}
            <span class="divider">|</span>
            <span class="location">${item.location}</span>
            <span class="divider">|</span>
            <span class="rate">${item.max_tarif ? `€${item.max_tarif}/u` : 'tarief niet vermeld'}</span>
        </div>
    `).join('');

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background: white;
                    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                }
                .container {
                    width: 1080px;
                    height: 1080px;
                    background: white;
                    padding: 50px;
                    box-sizing: border-box;
                }
                .header {
                    margin-bottom: 40px;
                    height: 80px;
                }
                /* Stijl voor het logo */
                .logo {
                    height: 100%;
                    width: auto;
                }
                .vacancies {
                    display: grid;
                    gap: 25px;
                }
                .vacancy {
                    font-size: 28px;
                    line-height: 1.3;
                    border-left: 5px solid #0066FF;
                    padding-left: 20px;
                }
                .divider {
                    color: #666;
                    margin: 0 8px;
                }
                .location {
                    color: #444;
                }
                .rate {
                    color: #0066FF;
                    font-weight: 500;
                }
            </style>
        </head>
        <body>
        <div class="container">
            <!-- Hier kunt u uw logo URL plakken -->
            <div class="header">
                <img class="logo" src="https://interimu.nl/wp-content/uploads/2024/02/InterimU.svg" alt="InterimU">
            </div>
        
            <div class="vacancies">
                <div class="vacancy">
                    Interim Jurist Omgevingsrecht Milieu - Handhaving
                    <span class="divider">|</span>
                    <span class="location">Eindhoven</span>
                    <span class="divider">|</span>
                    <span class="rate">€105/u</span>
                </div>
        
                <div class="vacancy">
                    Interim Communicatiemedewerker
                    <span class="divider">|</span>
                    <span class="location">Roosendaal</span>
                    <span class="divider">|</span>
                    <span class="rate">€80/u</span>
                </div>
        
                <div class="vacancy">
                    Interim Sr. Projectondersteuner voor Herontwikkeling De Nieuwe Korf
                    <span class="divider">|</span>
                    <span class="location">Leusden</span>
                    <span class="divider">|</span>
                    <span class="rate">€95/u</span>
                </div>
        
                <div class="vacancy">
                    Interim Projectleider Inburgering en Opvang Oekraiense Vluchtelingen
                    <span class="divider">|</span>
                    <span class="location">IJsselstein</span>
                    <span class="divider">|</span>
                    <span class="rate">tarief niet vermeld</span>
                </div>
        
                <div class="vacancy">
                    Interim Beleidsadviseur Sociaal Domain
                    <span class="divider">|</span>
                    <span class="location">Bergen op Zoom</span>
                    <span class="divider">|</span>
                    <span class="rate">€90/u</span>
                </div>
        
                <div class="vacancy">
                    Interim Adviseur Bedrijfsvoering voor Taakveld Bedrijfsvoering en Externe Dienstverlening
                    <span class="divider">|</span>
                    <span class="location">Utrecht</span>
                    <span class="divider">|</span>
                    <span class="rate">€110/u</span>
                </div>
        
                <div class="vacancy">
                    Interim Adviseur Inhuur
                    <span class="divider">|</span>
                    <span class="location">Breda</span>
                    <span class="divider">|</span>
                    <span class="rate">tarief niet vermeld</span>
                </div>
        
                <div class="vacancy">
                    Interim Aanbestedingsjurist
                    <span class="divider">|</span>
                    <span class="location">Eemsdelta</span>
                    <span class="divider">|</span>
                    <span class="rate">tarief niet vermeld</span>
                </div>
        
                <div class="vacancy">
                    Interim Medewerkers WOZ Bezwaren
                    <span class="divider">|</span>
                    <span class="location">Hollands Kroon</span>
                    <span class="divider">|</span>
                    <span class="rate">€67/u</span>
                </div>
            </div>
        </div>
        </body>
        </html>
    `;

    try {
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
            executablePath: '/usr/bin/google-chrome',
            args: ['--no-sandbox'],
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent);
        console.log("HTML content set successfully.");

        const screenshot = await page.screenshot({ fullPage: true });
        console.log("Screenshot taken successfully. Buffer length:", screenshot.length); // Log buffer length

        // Write the screenshot to a file
        writeFileSync("screenshot.png", screenshot);

        await browser.close();

        // Ensure the response is a valid image
        if (!screenshot || screenshot.length === 0) {
            return res.status(500).json({ error: 'No image data found' });
        }

        // Set the content type and Content-Disposition header to specify the filename
        res.set({
            'Content-Type': 'image/png',
            'Content-Disposition': 'attachment; filename="linkedin_cover.png"' // Specify the filename
        });
        res.sendFile('screenshot.png', { root: __dirname }); // Send the file
    } catch (error) {
        console.error('Error generating screenshot:', error);
        res.status(500).json({ error: 'Failed to generate screenshot' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
