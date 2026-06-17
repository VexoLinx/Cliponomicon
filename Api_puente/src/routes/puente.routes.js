const express = require("express");
const router = express.Router();

const {
    register,
    login,
    getMe,
    listUsers,
    getUser,
    patchUser,
    deleteUser,
    putAvatar,
    deleteAvatar,
    getAvatar,
    changePassword,
    getSteamGames,
    postVideo,
    getVideos,
    getVideo,
    patchVideo,
    deleteVideo,
    downloadVideo,
    streamVideo,
    getVideoThumbnail,
    postFavoriteVideo,
    deleteFavoriteVideo,
    getFavoriteVideosList,
    getVideoReactions,
    postVideoReaction,
    deleteVideoReaction
} = require("../services/externa.service");

// Helper to extract token from cookies
const getToken = (req) => req.cookies.auth_token;

// AUTH
router.post("/auth/register", async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const data = await register(username, password, role);
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.post("/auth/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const data = await login(username, password);
        
        // ESTABLECER COOKIE HTTPONLY
        res.cookie('auth_token', data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        });

        res.json({ ok: true, user: data.user });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.post("/auth/logout", (req, res) => {
    res.clearCookie('auth_token');
    res.json({ ok: true, message: "Logged out" });
});

router.get("/auth/me", async (req, res) => {
    try {
        const data = await getMe(getToken(req));
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

// USERS
router.get("/users", async (req, res) => {
    try {
        const data = await listUsers(getToken(req));
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.get("/users/:id", async (req, res) => {
    try {
        const data = await getUser(req.params.id, getToken(req));
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.patch("/users/:id", async (req, res) => {
    try {
        const data = await patchUser(req.params.id, req.body, getToken(req));
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.delete("/users/:id", async (req, res) => {
    try {
        const data = await deleteUser(req.params.id, getToken(req));
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

// USERS AVATAR
router.get("/users/:id/avatar", async (req, res) => {
    try {
        const data = await getAvatar(req.params.id, getToken(req));
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

// USERS PASSWORD
router.patch("/users/:id/password", async (req, res) => {
    try {
        const { new_password, current_password } = req.body;
        const data = await changePassword(req.params.id, new_password, current_password, getToken(req));
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

// STEAM
router.get("/steam/users/:id/games", async (req, res) => {
    try {
        const data = await getSteamGames(req.params.id, getToken(req));
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

// VIDEOS
router.get("/videos", async (req, res) => {
    try {
        const data = await getVideos(req.query, getToken(req));
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.get("/videos/:id", async (req, res) => {
    try {
        const data = await getVideo(req.params.id, getToken(req));
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.patch("/videos/:id", async (req, res) => {
    try {
        const data = await patchVideo(req.params.id, req.body, getToken(req));
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.delete("/videos/:id", async (req, res) => {
    try {
        const data = await deleteVideo(req.params.id, getToken(req));
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.get("/videos/:id/download", async (req, res) => {
    try {
        const data = await downloadVideo(req.params.id, getToken(req));
        res.send(data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.get("/videos/:id/stream", async (req, res) => {
    try {
        const { variant_type } = req.query;
        const stream = await streamVideo(req.params.id, variant_type, getToken(req));
        stream.pipe(res);
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.get("/videos/:id/thumbnail", async (req, res) => {
    try {
        const data = await getVideoThumbnail(req.params.id, getToken(req));
        res.send(data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

// FAVORITES
router.post("/videos/:id/favorite", async (req, res) => {
    try {
        const data = await postFavoriteVideo(req.params.id, getToken(req));
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.delete("/videos/:id/favorite", async (req, res) => {
    try {
        const data = await deleteFavoriteVideo(req.params.id, getToken(req));
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.get("/users/me/video-favorites", async (req, res) => {
    try {
        const data = await getFavoriteVideosList(getToken(req));
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

// REACTIONS
router.get("/videos/:id/reactions", async (req, res) => {
    try {
        const data = await getVideoReactions(req.params.id, getToken(req));
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.post("/videos/:id/reactions", async (req, res) => {
    try {
        const { reaction_type } = req.body;
        const data = await postVideoReaction(req.params.id, reaction_type, getToken(req));
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.delete("/videos/:id/reactions", async (req, res) => {
    try {
        const data = await deleteVideoReaction(req.params.id, getToken(req));
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

module.exports = router;
