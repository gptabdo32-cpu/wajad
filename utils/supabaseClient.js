// utils/supabaseClient.js
const { createClient } = require('@supabase/supabase-js');
const config = require('../config/config');

const supabase = createClient(config.database.supabaseUrl, config.database.supabaseAnonKey);

module.exports = supabase;
