"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cheerio_1 = __importDefault(require("cheerio"));
const cluster_1 = __importDefault(require("cluster"));
const cors_1 = __importDefault(require("cors"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const os_1 = __importDefault(require("os"));
function scrape(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const isAbsoluteUrl = url.startsWith('http://') || url.startsWith('https://');
        if (!isAbsoluteUrl) {
            const baseUrl = window.location.origin;
            url = `${baseUrl}${url}`;
        }
        const response = yield (0, node_fetch_1.default)(url);
        const html = yield response.text();
        const $ = cheerio_1.default.load(html);
        const data = {
            content: {
                robots: $("meta[name='robots']").attr('content'),
                description: $("meta[name='description']").attr('content'),
            },
            textContent: {
                title: $('title').text(),
                h1: $('h1').text(),
                h2: $('h2').text(),
                h3: $('h3').text(),
                h4: $('h4').text(),
                h5: $('h5').text(),
                h6: $('h6').text(),
            },
            href: {
                links: $('a')
                    .map((_, el) => $(el).attr('href') || '')
                    .get(),
                canonical: $("link[rel='canonical']").attr('href'),
                alternateMobile: $("link[media='only screen and (max-width: 640px)']").attr('href'),
                prevPagination: $("link[rel='prev']").attr('href'),
                nextPagination: $("link[rel='next']").attr('href'),
                amp: $("link[rel='amphtml']").attr('href'),
            },
            outerHTML: {
                hreflang: $('link[hreflang]')
                    .map((_, el) => $(el).prop('outerHTML') || '')
                    .get(),
            },
        };
        return data;
    });
}
const app = (0, express_1.default)();
const port = 8080;
app.use((0, cors_1.default)()); // Allow requests from all origins
if (cluster_1.default.isMaster) {
    for (let i = 0; i < os_1.default.cpus().length; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster_1.default.fork();
    });
}
else {
    app.get('/scrape', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        let url = req.query.url;
        // Check if URL starts with http or https, add protocol if not present
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = `http://${url}`;
        }
        try {
            const data = yield scrape(url);
            res.status(200).json(data);
        }
        catch (error) {
            console.error(`Error scraping ${url}: ${error}`);
            (_a = cluster_1.default.worker) === null || _a === void 0 ? void 0 : _a.disconnect();
            res.status(500).send(new Error(error.message));
        }
    }));
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
//# sourceMappingURL=index.js.map