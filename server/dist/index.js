function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
var __generator = this && this.__generator || function(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return(g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g);
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
import cors from "cors";
import express from "express";
import axios from "axios";
import cheerio from "cheerio-without-node-native";
import { fileURLToPath } from "url";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
var _process_env = process.env, FRONTEND_URI = _process_env.FRONTEND_URI, PORT = _process_env.PORT;
var app = express();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var corsOptions = {
    origin: FRONTEND_URI,
    optionsSuccessStatus: 200
};
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "..", "client", "dist")));
app.get("/scrape", function() {
    var _ref = _async_to_generator(function(req, res) {
        var url, _$_attr, _$_attr1, data, $, title, description, keywords, err;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    url = req.query.url;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        3,
                        ,
                        4
                    ]);
                    return [
                        4,
                        axios.get(url)
                    ];
                case 2:
                    data = _state.sent().data;
                    $ = cheerio.load(data);
                    title = $("title").text().trim();
                    description = (_$_attr = $('meta[name="description"]').attr("content")) === null || _$_attr === void 0 ? void 0 : _$_attr.trim();
                    keywords = (_$_attr1 = $('meta[name="keywords"]').attr("content")) === null || _$_attr1 === void 0 ? void 0 : _$_attr1.trim();
                    res.json({
                        title: title,
                        description: description,
                        keywords: keywords
                    });
                    return [
                        3,
                        4
                    ];
                case 3:
                    err = _state.sent();
                    console.error(err);
                    res.status(500).json({
                        message: "Failed to scrape URL"
                    });
                    return [
                        3,
                        4
                    ];
                case 4:
                    return [
                        2
                    ];
            }
        });
    });
    return function(req, res) {
        return _ref.apply(this, arguments);
    };
}());
app.get("*", function(_, res) {
    res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
});
var port = PORT || 5000;
debugger;
app.listen(port, function() {
    console.log("Server listening on port ".concat(port));
});
