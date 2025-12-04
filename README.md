# Twitch Wheel of Names

An interactive wheel of names application for Twitch streamers. Let your viewers join giveaways, raffles, or random selections directly through Twitch chat!

**Inspired by [AbsoluteLatte's Wheel of Names](https://absolutelatte.github.io/)**

## Features

- **Twitch Chat Integration** - Viewers can join the wheel by typing `!join` in chat
- **Broadcaster Controls** - Open/close entries with `!openwheel` and `!closewheel` commands
- **Real-time Updates** - Participants appear instantly on the wheel
- **Dark/Light Mode** - Toggle between themes for your stream setup
- **Persistent Storage** - Participants are saved locally, so refreshing won't lose your list
- **Manual Entry** - Add or remove participants manually through the UI

## How to Use

### For Streamers

1. **Navigate to your wheel**
   ```
   https://wheel-of-names-nine.vercel.app/your_twitch_username
   ```
   Replace `your_twitch_username` with your actual Twitch channel name.

2. **Open entries for viewers**
   - Click the **"Open Entries"** button in the UI, or
   - Type `!openwheel` in your Twitch chat (broadcaster only)

3. **Let viewers join**
   - Viewers type `!join` in your Twitch chat
   - Their names will automatically appear in the participants list

4. **Close entries**
   - Click the **"Close Entries"** button, or
   - Type `!closewheel` in your Twitch chat (broadcaster only)

5. **Spin the wheel**
   - Click on the wheel to spin it
   - The winner will be highlighted!

6. **Reset for next round**
   - Click **"Reset All"** to clear all participants

### For Viewers

1. Wait for the streamer to open the wheel (status shows "Accepting Entries")
2. Type `!join` in the Twitch chat
3. Your name will appear on the wheel
4. Watch the spin and hope for the best!

## Chat Commands

| Command | Who Can Use | Description |
|---------|-------------|-------------|
| `!join` | Everyone | Join the wheel (when entries are open) |
| `!openwheel` | Broadcaster | Open the wheel for entries |
| `!closewheel` | Broadcaster | Close the wheel for entries |




## Credits

- Inspired by [AbsoluteLatte's Wheel of Names](https://absolutelatte.github.io/)
- Wheel visualization powered by [PickerWheel](https://pickerwheel.com/)
- Twitch chat integration via [ComfyJS](https://github.com/instafluff/ComfyJS)


