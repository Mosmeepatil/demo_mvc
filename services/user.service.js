const getUserId = async (id, res) => {
    const userJson = await redis.get(id);
    if (userJson) {
        const user = JSON.parse(userJson)
        res.status(201).json({
            success: true,
            user
        })
    }

}
//In jwt.js add 3.55 change