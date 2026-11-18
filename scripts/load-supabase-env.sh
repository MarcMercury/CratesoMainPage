#!/usr/bin/env bash
# Usage: source scripts/load-supabase-env.sh
# Exports the EmployeeGM Supabase admin credentials stored as encrypted, development-only
# env vars on the Vercel project "crateso-main-page". Requires VERCEL_TOKEN. Nothing is written to disk.
_VT=team_oPBOpXX27n3U1EECJx94wfY4
_VP=prj_nf5TP9BawunLfF6t8SY65q1eUlKV
eval "$(python3 - "$_VP" "$_VT" <<'PY'
import json, os, shlex, sys, urllib.request
proj, team = sys.argv[1], sys.argv[2]
def get(url):
    req = urllib.request.Request(url, headers={'Authorization': 'Bearer ' + os.environ['VERCEL_TOKEN']})
    return json.load(urllib.request.urlopen(req))
base = f'https://api.vercel.com'
for e in get(f'{base}/v10/projects/{proj}/env?teamId={team}')['envs']:
    if e['key'].startswith('SUPABASE_') and e['target'] == ['development']:
        v = get(f"{base}/v1/projects/{proj}/env/{e['id']}?teamId={team}")['value']
        print(f"export {e['key']}={shlex.quote(v)}")
PY
)"
unset _VT _VP
