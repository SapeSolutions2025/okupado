import type { Database } from '@/types/supabase'
import { createClient } from '@supabase/supabase-js'
import { config } from './config'

// Verificar que las variables de entorno estén definidas
const supabaseUrl = config.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = config.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Faltan las variables de entorno de Supabase. Por favor, configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.',
  )
}

// Crear el cliente de Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
