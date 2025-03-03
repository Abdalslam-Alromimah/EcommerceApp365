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
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const admin = __importStar(require("firebase-admin"));
const userModel_1 = require("../models/userModel");
const login = async (req, res, next) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            res.status(400).json({ error: 'ID token is required' });
            return;
        }
        console.log('Token received:', typeof idToken, `${idToken.substring(0, 10)}...`);
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const email = decodedToken.email || null;
        const displayName = decodedToken.name || null;
        // Check if user exists; create or update if not
        let user = await (0, userModel_1.getUser)(uid);
        if (!user) {
            try {
                user = await (0, userModel_1.createUser)({ uid, email, displayName });
            }
            catch (createError) {
                if (createError.code === '23505' && createError.constraint === 'users_email_key') {
                    res.status(409).json({
                        error: 'Email already in use',
                        details: `The email ${email} is already associated with another user.`
                    });
                    return;
                }
                throw createError; // Re-throw other errors
            }
        }
        else if (user.email !== email || user.displayName !== displayName) {
            try {
                user = await (0, userModel_1.createUser)({ uid, email, displayName }); // Updates via ON CONFLICT
            }
            catch (updateError) {
                if (updateError.code === '23505' && updateError.constraint === 'users_email_key') {
                    res.status(409).json({
                        error: 'Email already in use',
                        details: `The email ${email} cannot be updated as it’s associated with another user.`
                    });
                    return;
                }
                throw updateError; // Re-throw other errors
            }
        }
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
        if (error.code === 'auth/argument-error') {
            res.status(400).json({
                error: 'Invalid token format',
                details: 'The token provided could not be decoded as a valid Firebase ID token.'
            });
            return;
        }
        next(error); // Pass unexpected errors to Express error handler
    }
};
exports.login = login;
