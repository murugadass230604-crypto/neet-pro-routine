const calculateLevel = (xp) => {
  if (xp >= 2000) return { level: 6, title: "Legend" };
  if (xp >= 1000) return { level: 5, title: "Champion" };
  if (xp >= 600) return { level: 4, title: "Achiever" };
  if (xp >= 300) return { level: 3, title: "Warrior" };
  if (xp >= 100) return { level: 2, title: "Disciplined" };
  return { level: 1, title: "Beginner" };
};

const addXPToUser = async (user, earnedXP) => {
  user.xp += earnedXP;

  const levelData = calculateLevel(user.xp);

  const levelUp = user.level !== levelData.title;

  user.level = levelData.title;

  await user.save();

  return {
    xp: user.xp,
    level: levelData.title,
    levelUp
  };
};

module.exports = { calculateLevel, addXPToUser };