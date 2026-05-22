# Twitch Wheel of Names

For IRL Stremers, use chat commands to open/close and spin the wheel.

OBS Browser Overlay version of wheel of names application for Twitch streamers. Let your viewers join giveaways, raffles, or random selections directly through Twitch chat with a beautiful custom-built spinning wheel!


**Inspired by [AbsoluteLatte's Wheel of Names](https://absolutelatte.github.io/)**

## Features

### Core Functionality
- 🎡 **Custom Canvas Wheel** - Smooth spinning animation with precise pointer alignment
- 💬 **Twitch Chat Integration** - Viewers join by typing `!join` in chat
- 🎮 **Broadcaster Controls** - Open/close entries with `!openwheel` and `!closewheel` commands
- ⚡ **Real-time Updates** - Participants appear instantly (supports up to 500 participants)
- 🎨 **Dark/Light Mode** - Toggle between themes optimized for streaming
- 💾 **Persistent Storage** - Settings and metadata saved locally
- ✏️ **Manual Entry** - Add, edit, or remove participants through the UI

### Wheel Customization
- 🎯 **Customizable Settings** - Adjust volume (0-100%), spin time (1-30s), and max visible participants (1-200)
- 🎵 **Sound Effects** - Satisfying tick sounds during spin + applause on winner (adjustable volume)
- 🏆 **Winner Dialog** - Announcement with options to Close, Remove winner, or Remove All instances
- ✏️ **Editable Wheel Title** - Customize your wheel title directly in the header
- 🔀 **Shuffle Feature** - Randomize participant order with Fisher-Yates algorithm
- 🎨 **Theme-Aware Colors** - 8-color palette that adapts to light/dark mode

### User Experience
- 🚀 **Fast Spin Animation** - Exciting fast start with smooth slowdown
- ⏱️ **Exact Duration Control** - Spin lasts exactly the time you set (1-30 seconds)
- 🔒 **Smart Controls** - All inputs disabled during spin to prevent accidents
- 📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- 🎯 **Visual Status Badge** - Clear "Accepting Entries" / "Entries Closed" indicator
- 🔄 **Auto-close on Spin** - Entries automatically close when wheel spins

## How to Use

### For Streamers

1. **Navigate to your wheel**
   ```
   https://wheel-of-names-nine.vercel.app/your_twitch_username
   ```
   Replace `your_twitch_username` with your actual Twitch channel name.

2. **Customize your wheel** (Optional)
   - Click the **"Customize"** button (⚙️) in the header
   - Adjust volume, spin duration, and max visible participants
   - Edit the wheel title by clicking the pencil icon next to the title

3. **Open entries for viewers**
   - Click the **"Open Entries"** button in the UI, or
   - Type `!openwheel` in your Twitch chat (broadcaster only)
   - Status badge will show "Accepting Entries" in green

4. **Let viewers join**
   - Viewers type `!join` in your Twitch chat
   - Their names will automatically appear in the participants list
   - Counter shows how many have joined (up to 500 participants)

5. **Manage participants** (Optional)
   - **Shuffle** - Randomize the order of participants
   - **Reset** - Clear all participants to start fresh
   - **Manual Edit** - Click on names to edit or remove individual entries

6. **Close entries**
   - Click the **"Close Entries"** button, or
   - Type `!closewheel` in your Twitch chat (broadcaster only)
   - Status badge will show "Entries Closed" in gray
   - Entries also close automatically when you spin

7. **Spin the wheel**
   - Click on the wheel to start the spin
   - Watch the exciting animation with sound effects
   - Winner will be announced in a dialog with options to:
     - **Close** - Just close the dialog
     - **Remove** - Remove this winner from the list
     - **Remove All** - Remove all instances of this winner's name

8. **Repeat for next round**
   - Spin again with remaining participants, or
   - Click **"Reset"** to clear everyone and start over

### For Viewers

1. Wait for the streamer to open the wheel (status shows "Accepting Entries")
2. Type `!join` in the Twitch chat
3. Your name will appear on the wheel
4. Watch the spin and hope for the best!

## Chat Commands

| Command | Who Can Use | Description |
|---------|-------------|-------------|
| `!join` | Everyone | Join the wheel (when entries are open) |
| `!openwheel` | Broadcaster Only | Open the wheel for entries |
| `!closewheel` | Broadcaster Only | Close the wheel for entries |

## Settings & Configuration

Access the settings dialog by clicking the **"Customize"** button in the header.

### Available Settings

| Setting | Range | Default | Description |
|---------|-------|---------|-------------|
| **Volume** | 0-100% | 70% | Sound effect volume (tick + applause) |
| **Spin Time** | 1-30s | 10s | How long the wheel spins |
| **Max Visible** | 1-200 | 100 | Maximum participants shown on wheel |

**Note:** All settings are saved automatically in your browser's local storage.

## Technical Stack

Built with modern web technologies for optimal performance:

- **Framework:** Next.js 15 (App Router)
- **Styling:** TailwindCSS v4 (CSS-first configuration)
- **Components:** ShadCN UI (new-york style)
- **Language:** TypeScript (strict mode enabled)
- **Validation:** Zod
- **Wheel Library:** spin-wheel (custom Canvas implementation)
- **Chat:** ComfyJS (Twitch integration)
- **State:** React hooks + localStorage
- **Deployment:** Vercel

## Credits

- **Inspiration:** [AbsoluteLatte's Wheel of Names](https://absolutelatte.github.io/)
- **Wheel Engine:** [spin-wheel](https://github.com/CrazyTim/spin-wheel) library
- **Twitch Integration:** [ComfyJS](https://github.com/instafluff/ComfyJS)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)



