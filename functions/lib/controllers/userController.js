"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsersHandler = exports.getUserHandler = exports.createUserHandler = void 0;
const userModel_1 = require("../models/userModel");
const createUserHandler = async (req, res, next) => {
    try {
        const { uid, email, displayName } = req.body;
        if (!uid) {
            res.status(400).json({ error: 'UID is required' });
            return;
        }
        const newUser = await (0, userModel_1.createUser)({ uid, email, displayName });
        res.status(201).json({ success: true, user: newUser });
    }
    catch (error) {
        next(error);
    }
};
exports.createUserHandler = createUserHandler;
const getUserHandler = async (req, res, next) => {
    var _a;
    try {
        const uid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid;
        if (!uid) {
            res.status(401).json({ error: 'Unauthorized: No user ID provided' });
            return;
        }
        const user = await (0, userModel_1.getUser)(uid);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserHandler = getUserHandler;
const listUsersHandler = async (req, res, next) => {
    try {
        const users = await (0, userModel_1.listUsers)();
        res.status(200).json({ success: true, users });
    }
    catch (error) {
        next(error);
    }
};
exports.listUsersHandler = listUsersHandler;
