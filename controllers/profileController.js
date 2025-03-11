// exports.updateProfile = async (req, res) => {
//     try {
//         if (!req.session.token) {
//             return res.status(401).json({ message: "Not authenticated" });
//         }

//         console.log("Token received:", req.session.token); // Debugging
//         console.log("Request body:", req.body); // Debugging
//         console.log("Uploaded file:", req.file); // Debugging

//         const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET);
//         const { username, bio } = req.body;
//         let updateData = { "profile.username": username, "profile.bio": bio };

//         // ✅ Ensure file is uploaded before accessing req.file
//         if (req.file) {
//             updateData["profile.profilePicture"] = `/uploads/${req.file.filename}`;
//             console.log("Profile picture uploaded:", req.file.filename); // Debugging
//         } else {
//             console.log("No profile picture uploaded."); // Debugging
//         }

//         // ✅ Update user in the database
//         const updatedUser = await User.findByIdAndUpdate(
//             decoded.id,
//             { $set: updateData },
//             { new: true }
//         ).select("-password");

//         if (!updatedUser) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         console.log("Updated user:", updatedUser); // Debugging
//         res.redirect('/profile'); // Redirect to profile ✅
//     } catch (error) {
//         console.error("Profile update error:", error);
//         res.status(500).send("Server Error");
//     }
// };
