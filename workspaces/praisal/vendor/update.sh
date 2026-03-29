#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
GAME_VERSION=""

usage() {
    cat <<'EOF'
Usage: ./update.sh [--game-version <version>] <steam-library-root>

Example:
  ./update.sh "$HOME/.local/share/Steam"

The argument must be the Steam library root that contains:
  steamapps/common/SpaceEngineers/Content/Data
EOF
}

log() {
    printf '[vendor-update] %s\n' "$*"
}

fail() {
    printf '[vendor-update] %s\n' "$*" >&2
    exit 1
}

require_command() {
    command -v "$1" >/dev/null 2>&1 || fail "Missing required command: $1"
}

has_command() {
    command -v "$1" >/dev/null 2>&1
}

parse_args() {
    local positional=()

    while [[ $# -gt 0 ]]; do
        case "$1" in
            --game-version)
                [[ $# -ge 2 ]] || fail "Missing value for --game-version"
                GAME_VERSION="$2"
                shift 2
                ;;
            --help)
                usage
                exit 0
                ;;
            *)
                positional+=("$1")
                shift
                ;;
        esac
    done

    [[ ${#positional[@]} -eq 1 ]] || {
        usage
        exit 1
    }

    printf '%s\n' "${positional[0]}"
}

copy_file() {
    local source="$1"
    local dest="$2"

    [[ -f "$source" ]] || fail "Missing source file: $source"
    cp "$source" "$dest"
}

normalize_file() {
    local filename="$1"

    if has_command uconv; then
        local temp_file
        temp_file="$(mktemp)"
        cp "$filename" "$temp_file"
        uconv -f utf8 -t utf8 --remove-signature "$temp_file" -o "$filename"
        rm -f "$temp_file"
        return 0
    fi

    if has_command iconv; then
        local temp_file
        temp_file="$(mktemp)"
        iconv -f utf-8 -t utf-8 "$filename" > "$temp_file"
        mv "$temp_file" "$filename"
        sed -i $'1s/^\xEF\xBB\xBF//' "$filename"
        return 0
    fi

    sed -i $'1s/^\xEF\xBB\xBF//' "$filename"
}

prepare_dir() {
    local dir="$1"
    mkdir -p "$dir"
}

read_version_from_text_file() {
    local candidate="$1"

    [[ -f "$candidate" ]] || return 1

    grep -Eom1 '[0-9]+\.[0-9]{3}\.[0-9]{3}' "$candidate" || return 1
}

read_version_from_binary_file() {
    local candidate="$1"

    [[ -f "$candidate" ]] || return 1

    grep -aEo '[0-9]+\.[0-9]{3}\.[0-9]{3}' "$candidate" | sort -u | tail -n 1 || return 1
}

detect_game_version() {
    local steam_dir="$1"
    local se_dir="$2"
    local candidate
    local version

    if [[ -n "$GAME_VERSION" ]]; then
        printf '%s\n' "$GAME_VERSION"
        return 0
    fi

    for candidate in \
        "$se_dir/version.txt" \
        "$se_dir/Version.txt" \
        "$se_dir/Content/version.txt" \
        "$se_dir/Content/Version.txt"
    do
        if version="$(read_version_from_text_file "$candidate")"; then
            printf '%s\n' "$version"
            return 0
        fi
    done

    for candidate in \
        "$se_dir/Bin64/SpaceEngineers.exe" \
        "$se_dir/Bin/SpaceEngineers.exe"
    do
        if version="$(read_version_from_binary_file "$candidate")"; then
            printf '%s\n' "$version"
            return 0
        fi
    done

    fail "Could not detect the Space Engineers version automatically. Re-run with --game-version <version>."
}

write_game_version() {
    local steam_dir="$1"
    local se_dir="$2"
    local version

    version="$(detect_game_version "$steam_dir" "$se_dir")"
    printf '%s\n' "$version" > "$SCRIPT_DIR/version.txt"
    log "Updated version.txt to $version"
}

copy_vanilla_cubeblocks() {
    local source_dir="$1"
    local dest_dir="$2"

    prepare_dir "$dest_dir"

    find "$dest_dir" -maxdepth 1 -type f -name '*.sbc' -delete

    while IFS= read -r -d '' file; do
        cp "$file" "$dest_dir/"
    done < <(
        find "$source_dir" -type f -name '*.sbc' \
            ! -name '*Frostbite*' \
            ! -name '*Economy*' \
            ! -name '*DecorativePack*' \
            ! -name '*SparksOfTheFuturePack*' \
            ! -name '*ScrapRacePack*' \
            ! -name '*Warfare1*' \
            ! -name '*IndustrialPack*' \
            ! -name '*Warfare2*' \
            ! -name '*Automation*' \
            ! -name '*DecorativePack3*' \
            ! -name '*SignalsPack*' \
            ! -name '*ContactPack*' \
            -print0
    )
}

main() {
    local steam_dir
    local se_dir
    local data_dir
    local folder

    require_command cp
    require_command find
    require_command grep
    require_command sort
    require_command sed
    require_command tail
    if has_command uconv || has_command iconv; then
        require_command mktemp
    fi

    steam_dir="$(parse_args "$@")"
    steam_dir="${steam_dir%/}"
    se_dir="$steam_dir/steamapps/common/SpaceEngineers"
    data_dir="$se_dir/Content/Data"

    [[ -d "$data_dir" ]] || fail "Could not find Space Engineers data directory: $data_dir"

    cd "$SCRIPT_DIR"

    log "Updating vendor data from $data_dir"
    write_game_version "$steam_dir" "$se_dir"

    folder="Vanilla"
    prepare_dir "$folder"
    copy_file "$data_dir/Blueprints.sbc" "$folder/"
    copy_file "$data_dir/Components.sbc" "$folder/"
    copy_file "$data_dir/PhysicalItems.sbc" "$folder/"
    copy_vanilla_cubeblocks "$data_dir/CubeBlocks" "$folder/CubeBlocks"

    folder="DecorativePack"
    prepare_dir "$folder"
    copy_file "$data_dir/CubeBlocks/CubeBlocks_${folder}.sbc" "$folder/CubeBlocks.sbc"

    folder="DecorativePack2"
    prepare_dir "$folder"
    copy_file "$data_dir/CubeBlocks/CubeBlocks_${folder}.sbc" "$folder/CubeBlocks.sbc"

    folder="Economy"
    prepare_dir "$folder"
    copy_file "$data_dir/Blueprints_${folder}.sbc" "$folder/Blueprints.sbc"
    copy_file "$data_dir/Components_${folder}.sbc" "$folder/Components.sbc"
    copy_file "$data_dir/PhysicalItems_${folder}.sbc" "$folder/PhysicalItems.sbc"
    copy_file "$data_dir/CubeBlocks/CubeBlocks_${folder}.sbc" "$folder/CubeBlocks.sbc"

    folder="Frostbite"
    prepare_dir "$folder"
    copy_file "$data_dir/CubeBlocks/CubeBlocks_${folder}.sbc" "$folder/CubeBlocks.sbc"

    folder="SparksOfTheFuturePack"
    prepare_dir "$folder"
    copy_file "$data_dir/CubeBlocks/CubeBlocks_${folder}.sbc" "$folder/CubeBlocks.sbc"

    folder="ScrapRacePack"
    prepare_dir "$folder"
    copy_file "$data_dir/CubeBlocks/CubeBlocks_${folder}.sbc" "$folder/CubeBlocks.sbc"

    folder="Warfare1"
    prepare_dir "$folder"
    copy_file "$data_dir/CubeBlocks/CubeBlocks_${folder}.sbc" "$folder/CubeBlocks.sbc"

    folder="IndustrialPack"
    prepare_dir "$folder"
    copy_file "$data_dir/CubeBlocks/CubeBlocks_${folder}.sbc" "$folder/CubeBlocks.sbc"

    folder="Warfare2"
    prepare_dir "$folder"
    copy_file "$data_dir/CubeBlocks/CubeBlocks_${folder}.sbc" "$folder/CubeBlocks.sbc"

    folder="Automation"
    prepare_dir "$folder"
    copy_file "$data_dir/CubeBlocks/CubeBlocks_${folder}.sbc" "$folder/CubeBlocks.sbc"

    folder="DecorativePack3"
    prepare_dir "$folder"
    copy_file "$data_dir/CubeBlocks/CubeBlocks_${folder}.sbc" "$folder/CubeBlocks.sbc"

    folder="SignalsPack"
    prepare_dir "$folder"
    copy_file "$data_dir/CubeBlocks/CubeBlocks_${folder}.sbc" "$folder/CubeBlocks.sbc"

    folder="ContactPack"
    prepare_dir "$folder"
    copy_file "$data_dir/CubeBlocks/CubeBlocks_${folder}.sbc" "$folder/CubeBlocks.sbc"

    while IFS= read -r -d '' file; do
        sed -i 's/\r$//' "$file"
        normalize_file "$file"
    done < <(find . -type f -name '*.sbc' -print0)

    log "Vendor data update complete"
}

main "$@"
