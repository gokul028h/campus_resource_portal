// Add these new controller methods:

// Google Login/Signup handler
const handleGoogleAuth = async (req, res) => {
  const { email, name, googleId } = req.body;
  
  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If user exists with password auth, allow migration
      if (existingUser.authMethod === 'password') {
        return res.status(409).json({ 
          message: "Account exists with password login. Migrate to Google?",
          requiresMigration: true
        });
      }
      
      // Standard Google login
      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
      return res.status(200).json({
        message: "Google login successful",
        user: existingUser,
        token
      });
    }

    // New Google user signup
    const username = email.split('@')[0];
    const newUser = new User({
      username,
      name,
      email,
      googleId,
      isGoogleUser: true,
      authMethod: 'google'
    });

    await newUser.save();
    
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(201).json({
      message: "Google signup successful",
      user: newUser,
      token
    });

  } catch (err) {
    console.error("Google auth error:", err);
    res.status(500).json({ message: "Google authentication failed" });
  }
};

// Migrate to Google auth
const migrateToGoogle = async (req, res) => {
  const { email } = req.params;
  const { googleId } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { 
        googleId,
        isGoogleUser: true,
        authMethod: 'google',
        password: undefined 
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({
      message: "Account migrated to Google successfully",
      user,
      token
    });
  } catch (err) {
    console.error("Migration error:", err);
    res.status(500).json({ message: "Account migration failed" });
  }
};

// Update signupUser to handle Google users better
const signupUser = async (req, res) => {
  const { username, name, email, password, isGoogleUser, googleId } = req.body;

  try {
    if (!email.endsWith("@gmail.com") && !email.endsWith("@vit.ac.in")) {
      return res.status(400).json({ message: "Only Gmail or VIT email allowed" });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.authMethod !== 'google' && isGoogleUser) {
        return res.status(409).json({ 
          message: "Account exists with different login method",
          requiresMigration: true
        });
      }
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = isGoogleUser ? undefined : await bcrypt.hash(password, 10);

    const user = new User({
      username,
      name,
      email,
      password: hashedPassword,
      isGoogleUser: !!isGoogleUser,
      googleId: isGoogleUser ? googleId : undefined,
      authMethod: isGoogleUser ? 'google' : 'password'
    });

    await user.save();
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(201).json({ 
      message: "Signup successful",
      user,
      token
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
};

// Update loginUser to handle Google auth
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Handle Google users
    if (user.authMethod === 'google') {
      return res.status(403).json({ 
        message: "Account uses Google login",
        requiresGoogleAuth: true
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

// Add these to exports
module.exports = {
  uploadProfilePic,
  getProfilePic,
  getUserHistory,
  signupUser,
  loginUser,
  handleGoogleAuth,
  migrateToGoogle
};