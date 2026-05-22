import { db, sqlite } from '../infrastructure/db'
import { exercises } from '../../drizzle/schema'
import { eq } from 'drizzle-orm'

/**
 * Seed inicial del catálogo de ejercicios.
 *
 * Uso: pnpm db:seed
 *
 * Idempotente: si un ejercicio con el mismo nombre ya existe, lo salta.
 * Solo inserta los del catálogo (isCustom: false).
 */

interface SeedExercise {
  name: string
  category: 'compound' | 'isolation' | 'cardio' | 'bodyweight' | 'stretching'
  primaryMuscle: string
  secondaryMuscles: string[]
  equipment: string | null
}

const CATALOG: SeedExercise[] = [
  // ── PECHO ──
  { name: 'Press banca', category: 'compound', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: 'Barra' },
  { name: 'Press banca inclinado', category: 'compound', primaryMuscle: 'chest', secondaryMuscles: ['shoulders', 'triceps'], equipment: 'Barra' },
  { name: 'Press con mancuernas', category: 'compound', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: 'Mancuernas' },
  { name: 'Aperturas con mancuernas', category: 'isolation', primaryMuscle: 'chest', secondaryMuscles: [], equipment: 'Mancuernas' },
  { name: 'Fondos en paralelas', category: 'compound', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: 'Paralelas' },

  // ── ESPALDA ──
  { name: 'Dominadas', category: 'bodyweight', primaryMuscle: 'back', secondaryMuscles: ['biceps'], equipment: 'Barra de dominadas' },
  { name: 'Remo con barra', category: 'compound', primaryMuscle: 'back', secondaryMuscles: ['biceps'], equipment: 'Barra' },
  { name: 'Remo con mancuerna', category: 'compound', primaryMuscle: 'back', secondaryMuscles: ['biceps'], equipment: 'Mancuernas' },
  { name: 'Jalón al pecho', category: 'compound', primaryMuscle: 'back', secondaryMuscles: ['biceps'], equipment: 'Polea' },
  { name: 'Peso muerto', category: 'compound', primaryMuscle: 'back', secondaryMuscles: ['hamstrings', 'glutes'], equipment: 'Barra' },

  // ── HOMBROS ──
  { name: 'Press militar', category: 'compound', primaryMuscle: 'shoulders', secondaryMuscles: ['triceps'], equipment: 'Barra' },
  { name: 'Press hombro con mancuernas', category: 'compound', primaryMuscle: 'shoulders', secondaryMuscles: ['triceps'], equipment: 'Mancuernas' },
  { name: 'Elevaciones laterales', category: 'isolation', primaryMuscle: 'shoulders', secondaryMuscles: [], equipment: 'Mancuernas' },
  { name: 'Pájaros (rear delt fly)', category: 'isolation', primaryMuscle: 'shoulders', secondaryMuscles: [], equipment: 'Mancuernas' },

  // ── BÍCEPS ──
  { name: 'Curl con barra', category: 'isolation', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], equipment: 'Barra' },
  { name: 'Curl con mancuernas', category: 'isolation', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], equipment: 'Mancuernas' },
  { name: 'Curl martillo', category: 'isolation', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], equipment: 'Mancuernas' },

  // ── TRÍCEPS ──
  { name: 'Press francés', category: 'isolation', primaryMuscle: 'triceps', secondaryMuscles: [], equipment: 'Barra' },
  { name: 'Extensión en polea', category: 'isolation', primaryMuscle: 'triceps', secondaryMuscles: [], equipment: 'Polea' },
  { name: 'Fondos en banco', category: 'bodyweight', primaryMuscle: 'triceps', secondaryMuscles: ['chest'], equipment: 'Banco' },

  // ── PIERNA ──
  { name: 'Sentadilla', category: 'compound', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], equipment: 'Barra' },
  { name: 'Prensa de pierna', category: 'compound', primaryMuscle: 'quads', secondaryMuscles: ['glutes'], equipment: 'Máquina' },
  { name: 'Extensión de cuádriceps', category: 'isolation', primaryMuscle: 'quads', secondaryMuscles: [], equipment: 'Máquina' },
  { name: 'Curl femoral', category: 'isolation', primaryMuscle: 'hamstrings', secondaryMuscles: [], equipment: 'Máquina' },
  { name: 'Hip thrust', category: 'compound', primaryMuscle: 'glutes', secondaryMuscles: ['hamstrings'], equipment: 'Barra' },
  { name: 'Zancadas', category: 'compound', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], equipment: 'Mancuernas' },
  { name: 'Elevación de gemelos', category: 'isolation', primaryMuscle: 'calves', secondaryMuscles: [], equipment: 'Máquina' },

  // ── CORE ──
  { name: 'Plancha', category: 'bodyweight', primaryMuscle: 'core', secondaryMuscles: [], equipment: null },
  { name: 'Crunch', category: 'isolation', primaryMuscle: 'core', secondaryMuscles: [], equipment: null },
  { name: 'Elevación de piernas colgado', category: 'bodyweight', primaryMuscle: 'core', secondaryMuscles: [], equipment: 'Barra de dominadas' },

  // ── CARDIO ──
  { name: 'Correr', category: 'cardio', primaryMuscle: 'fullbody', secondaryMuscles: [], equipment: null },
  { name: 'Bicicleta estática', category: 'cardio', primaryMuscle: 'quads', secondaryMuscles: ['hamstrings', 'calves'], equipment: 'Bicicleta' },
  { name: 'Remo (máquina)', category: 'cardio', primaryMuscle: 'fullbody', secondaryMuscles: [], equipment: 'Remo' },
]

async function main(): Promise<void> {
  console.log(`🌱 Seed: ${CATALOG.length} ejercicios candidatos`)

  let inserted = 0
  let skipped = 0

  for (const ex of CATALOG) {
    // Comprueba si ya existe por nombre (idempotencia)
    const existing = await db
      .select({ id: exercises.id })
      .from(exercises)
      .where(eq(exercises.name, ex.name))
      .limit(1)

    if (existing.length > 0) {
      skipped++
      continue
    }

    await db.insert(exercises).values({
      name: ex.name,
      category: ex.category,
      primaryMuscle: ex.primaryMuscle,
      secondaryMuscles: ex.secondaryMuscles,
      equipment: ex.equipment,
      isCustom: false,
    })
    inserted++
  }

  console.log(`✅ Insertados: ${inserted}`)
  console.log(`⏭  Saltados (ya existían): ${skipped}`)

  sqlite.close()
}

main().catch((err) => {
  console.error('❌ Error en seed:', err)
  sqlite.close()
  process.exit(1)
})
