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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const admin = __importStar(require("firebase-admin"));
/**
 * @route POST /auth/login
 * @desc Authenticate a user with a Firebase ID token
 * @access Public
 * @param {string} req.body.idToken - Firebase ID token
 * @returns {object} 200 - Success response with user data
 * @returns {object} 400 - Error if ID token is missing
 * @returns {object} 401 - Error if token is invalid or expired
 * @returns {object} 500 - Internal server error
 */
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idToken = req.body.idToken;
        if (!idToken) {
            res.status(400).json({ error: 'ID token is required' });
            return;
        }
        const firebaseAdmin = admin;
        const decodedToken = yield firebaseAdmin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const email = decodedToken.email || null;
        const displayName = decodedToken.name || null;
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                uid,
                email,
                displayName,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        if (error.code === 'auth/id-token-expired' || error.code === 'auth/id-token-revoked') {
            res.status(401).json({ error: 'Invalid or expired token' });
            return;
        }
        next(error);
    }
});
exports.login = login;
//# sourceMappingURL=authController.js.map