"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.logoutUser = exports.loginUser = void 0;
const userModel_1 = require("../models/userModel");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const jwt_1 = require("../utils/jwt");
exports.loginUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel_1.User.findOne({ email });
    if (!user) {
        throw new apiError_1.ApiError(404, "User not found");
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new apiError_1.ApiError(401, "Invalid password");
    }
    const accessToken = (0, jwt_1.generateAccessToken)(user._id.toString());
    const refreshToken = (0, jwt_1.generateRefreshToken)(user._id.toString());
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    const loggedInUser = await userModel_1.User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new apiResponse_1.ApiResponse(200, {
        user: loggedInUser,
        accessToken,
        refreshToken
    }, "User logged in successfully"));
});
exports.logoutUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await userModel_1.User.findByIdAndUpdate(req.user._id, {
        $unset: {
            refreshToken: 1
        }
    }, {
        new: true
    });
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse_1.ApiResponse(200, {}, "User logged out"));
});
exports.getCurrentUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    return res
        .status(200)
        .json(new apiResponse_1.ApiResponse(200, req.user, "User fetched successfully"));
});
//# sourceMappingURL=userController.js.map