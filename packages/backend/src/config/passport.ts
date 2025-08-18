import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { getDataSource } from '../database/index';
import { UserEntity } from '../database/entities/User';

export const configurePassport = () => {
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email: string, password: string, done) => {
      try {
        const dataSource = getDataSource();
        const userRepository = dataSource.getRepository(UserEntity);
        
        const user = await userRepository.findOne({
          where: { email }
        });

        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        
        if (!isValidPassword) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const dataSource = getDataSource();
      const userRepository = dataSource.getRepository(UserEntity);
      
      const user = await userRepository.findOne({
        where: { id }
      });

      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};