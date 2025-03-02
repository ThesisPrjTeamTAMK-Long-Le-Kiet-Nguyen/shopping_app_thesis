const app = require('./backend/app');
const config = require('./backend/utils/config');
const logger = require('./backend/utils/logger');
const mongoose = require('mongoose');

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});