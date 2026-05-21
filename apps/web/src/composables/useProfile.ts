import { ref, readonly } from 'vue'
import type { Profile } from '@vitaroot/shared'
import { getProfile, updateProfile, type UpdateProfileInput } from '@/api/system'

const profile = ref<Profile | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export function useProfile() {
  async function load(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      profile.value = await getProfile()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error cargando perfil'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function update(patch: UpdateProfileInput): Promise<Profile> {
    const updated = await updateProfile(patch)
    profile.value = updated
    return updated
  }

  return {
    profile: readonly(profile),
    loading: readonly(loading),
    error: readonly(error),
    load,
    update,
  }
}
