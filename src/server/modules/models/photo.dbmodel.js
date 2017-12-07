/*
* @Author: Craig Bojko
* @Date:   2017-10-14 11:26:17
* @Last Modified by:   Craig Bojko
* @Last Modified time: 2017-12-07 19:38:41
*/

import autoIncrement from 'mongoose-auto-increment'

export default function PhotoModel (Mongoose) {
  autoIncrement.initialize(Mongoose)
  let Schema = Mongoose.Schema
  let ObjectId = Schema.ObjectId

  let photoSchema = new Schema({
    id: ObjectId,
    uid: Number,
    keyword: String,
    email: String,
    timestamp: Number,
    filename: String,
    originalname: String,
    size: Number,
    mimetype: String,
    public: Boolean,
    enabled: Boolean,
    review: { type: Boolean, default: false }
  })

  photoSchema.plugin(autoIncrement.plugin, {
    model: 'Photo',
    field: 'uid',
    startAt: 1
  })

  return Mongoose.model('photos', photoSchema, 'photos')
}
