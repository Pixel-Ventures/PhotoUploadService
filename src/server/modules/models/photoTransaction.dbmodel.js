/*
* @Author: Craig Bojko
* @Date:   2017-12-07 15:51:15
* @Last Modified by:   Craig Bojko
* @Last Modified time: 2017-12-07 19:19:48
*/

import autoIncrement from 'mongoose-auto-increment'

export default function PhotoTransactionModel (Mongoose) {
  autoIncrement.initialize(Mongoose)
  let Schema = Mongoose.Schema
  let ObjectId = Schema.ObjectId

  let photoTransactionSchema = new Schema({
    id: ObjectId,
    uid: Number,
    timestamp: Number,
    files: {type: Array, default: []}
  })

  photoTransactionSchema.plugin(autoIncrement.plugin, {
    model: 'PhotoTransactions',
    field: 'uid',
    startAt: 1
  })

  return Mongoose.model('photoTransactions', photoTransactionSchema, 'photo-transactions')
}
