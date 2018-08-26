import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';
import mongooseDelete from 'mongoose-delete';

import * as errors from './utils/errors';
import config from './utils/config';
import lodgeRoutes from './modules/lodge/routes';
import userRoutes from './modules/user/routes';

const app = express();
mongoose.connect(
  config.mongoUrl,
  { useNewUrlParser: true }
);
mongoose.plugin(mongooseDelete);
app.use(morgan('dev'));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', config.port);
app.get('/', (req, res) => res.send('OK'));
app.use('/v1/lodge', lodgeRoutes);
app.use('/v1/user', userRoutes);
app.use(errors.notFound);
if (config.env === 'development') {
  app.use(errors.developmentErrors);
}

app.use(errors.productionErrors);

app.listen(app.get('port'), () => console.log('Have you seen the arrow?'));