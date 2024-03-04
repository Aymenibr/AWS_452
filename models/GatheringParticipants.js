module.exports = (sequelize, DataTypes) => {
  const GatheringParticipants = sequelize.define("GatheringParticipants", {});

    GatheringParticipants.associate = (models) => {
        GatheringParticipants.belongsTo(models.Gatherings, {
            foreignKey: "gatheringId",
        });
        GatheringParticipants.belongsTo(models.Users, {
            foreignKey: "userId",
        });
    }
  return GatheringParticipants;
};
