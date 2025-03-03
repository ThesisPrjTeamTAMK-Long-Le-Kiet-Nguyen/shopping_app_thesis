import app from './backend/app'
import config from './backend/utils/config'
import logger from './backend/utils/logger'
import mongoose from 'mongoose'

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message)
  })

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})