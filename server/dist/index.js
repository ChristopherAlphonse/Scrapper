"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const os_1 = __importDefault(require("os"));
function scrape(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const nodeFetch = yield Promise.resolve().then(() => __importStar(require('node-fetch')));
        const fetch = nodeFetch.default;
        const response = yield fetch(url);
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
                    .map((_, el) => { var _a; return (_a = $(el).attr('href')) !== null && _a !== void 0 ? _a : ''; })
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
app.use((0, cors_1.default)());
if (cluster_1.default.isPrimary) {
    const numCPUs = os_1.default.cpus().length;
    for (let i = 0; i < numCPUs; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster_1.default.fork();
    });
}
else {
    app.get('/scrape', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            res.status(500).send('Error scraping the provided URL');
        }
    }));
    app.listen(port, () => {
        console.log(`Worker ${process.pid} is running on port ${port}`);
    });
}
//# sourceMappingURL=index.js.map