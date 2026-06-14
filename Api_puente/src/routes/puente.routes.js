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
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.get("/auth/me", async (req, res) => {
    try {
        const data = await getMe();
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

// USERS
router.get("/users", async (req, res) => {
    try {
        const data = await listUsers();
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.get("/users/:id", async (req, res) => {
    try {
        const data = await getUser(req.params.id);
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.patch("/users/:id", async (req, res) => {
    try {
        const data = await patchUser(req.params.id, req.body);
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.delete("/users/:id", async (req, res) => {
    try {
        const data = await deleteUser(req.params.id);
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

// USERS AVATAR
router.get("/users/:id/avatar", async (req, res) => {
    try {
        const data = await getAvatar(req.params.id);
        res.set('Content-Type', 'image/png'); // O el tipo correspondiente
        res.send(data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

// USERS PASSWORD
router.patch("/users/:id/password", async (req, res) => {
    try {
        const { new_password, current_password } = req.body;
        const data = await changePassword(req.params.id, new_password, current_password);
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

// STEAM
router.get("/steam/users/:id/games", async (req, res) => {
    try {
        const data = await getSteamGames(req.params.id);
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

// VIDEOS
router.get("/videos", async (req, res) => {
    try {
        const data = await getVideos(req.query);
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.get("/videos/:id", async (req, res) => {
    try {
        const data = await getVideo(req.params.id);
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.patch("/videos/:id", async (req, res) => {
    try {
        const data = await patchVideo(req.params.id, req.body);
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.delete("/videos/:id", async (req, res) => {
    try {
        const data = await deleteVideo(req.params.id);
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.get("/videos/:id/download", async (req, res) => {
    try {
        const data = await downloadVideo(req.params.id);
        res.set('Content-Type', 'video/mp4');
        res.send(data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.get("/videos/:id/stream", async (req, res) => {
    try {
        const data = await streamVideo(req.params.id, req.query.variant_type);
        res.set('Content-Type', 'video/mp4');
        res.send(data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.get("/videos/:id/thumbnail", async (req, res) => {
    try {
        const data = await getVideoThumbnail(req.params.id);
        res.set('Content-Type', 'image/jpeg');
        res.send(data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

// FAVORITES
router.post("/videos/:id/favorite", async (req, res) => {
    try {
        const data = await postFavoriteVideo(req.params.id);
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.delete("/videos/:id/favorite", async (req, res) => {
    try {
        const data = await deleteFavoriteVideo(req.params.id);
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.get("/users/me/video-favorites", async (req, res) => {
    try {
        const data = await getFavoriteVideosList();
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

// REACTIONS
router.get("/videos/:id/reactions", async (req, res) => {
    try {
        const data = await getVideoReactions(req.params.id);
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.post("/videos/:id/reactions", async (req, res) => {
    try {
        const data = await postVideoReaction(req.params.id, req.body.reaction_type);
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

router.delete("/videos/:id/reactions", async (req, res) => {
    try {
        const data = await deleteVideoReaction(req.params.id);
        res.json({ ok: true, data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ ok: false, message: error.message });
    }
});

module.exports = router;
