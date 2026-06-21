
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Document = sequelize.define('Document', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id',
      },
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    s3Key: {
      type: DataTypes.STRING,
      allowNull: true, // Can be null if using local storage fallback
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true, // Direct URL to the document (S3 or local)
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    uploadedBy: {
      type: DataTypes.UUID,
      allowNull: true, // Can be null if uploaded by client (unauthenticated) or system
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {
    tableName: 'documents',
    timestamps: true,
  });

  Document.associate = (models) => {
    Document.belongsTo(models.Client, { foreignKey: 'clientId', as: 'client' });
    Document.belongsTo(models.User, { foreignKey: 'uploadedBy', as: 'uploader' });
  };

  return Document;
};
