/**
 * User Preferences Controller
 * Handles reading and writing per-user suggestionsEnabled settings.
 */

const dataStore = require('../data/dataStore');

/**
 * GET /api/users/:id/preferences
 */
async function getUserPreferences(req, res) {
  try {
    const { id } = req.params;
    if (!id || !id.trim()) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await dataStore.getUserById(id.trim());
    if (!user) {
      return res.status(404).json({ error: `User with ID '${id}' not found` });
    }

    return res.status(200).json({
      id: user.id,
      suggestionsEnabled: user.suggestionsEnabled !== false
    });

  } catch (err) {
    console.error('Error in getUserPreferences:', err);
    return res.status(500).json({ error: 'Internal server error getting user preferences' });
  }
}

/**
 * POST /api/users/:id/preferences
 * Body: { suggestionsEnabled: boolean }
 */
async function updateUserPreferences(req, res) {
  try {
    const { id } = req.params;
    const { suggestionsEnabled } = req.body || {};

    if (!id || !id.trim()) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (typeof suggestionsEnabled !== 'boolean') {
      return res.status(400).json({ error: 'suggestionsEnabled is required and must be a boolean' });
    }

    const updatedUser = await dataStore.updateUserPreferences(id.trim(), { suggestionsEnabled });
    if (!updatedUser) {
      return res.status(404).json({ error: `User with ID '${id}' not found` });
    }

    return res.status(200).json({
      id: updatedUser.id,
      suggestionsEnabled: updatedUser.suggestionsEnabled
    });

  } catch (err) {
    console.error('Error in updateUserPreferences:', err);
    return res.status(500).json({ error: 'Internal server error updating user preferences' });
  }
}

module.exports = {
  getUserPreferences,
  updateUserPreferences
};
