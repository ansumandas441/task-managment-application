import * as bcrypt from 'bcrypt';

export const hashPassword = async (password): Promise<string> => {
    const saltRounds = 12; 
    return await bcrypt.hash(password, saltRounds);
}

export const verifyPassword = async (hash, password): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}