export const getCurrentUser = async (req, res) => {
  try {
    console.log('called');
    if (!req.user) {
      return res.status(401).json({ user: null });
    }

    return res.status(200).json({
      user: req.user,
      message: 'User fetched successfully',
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error! get current user error' });
  }
};
