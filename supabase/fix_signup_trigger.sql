-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Only proceed if role is present in metadata (e.g. from Email Signup)
  -- This prevents errors for OAuth signups where role might not be known yet
  if (new.raw_user_meta_data->>'role' is not null and (new.raw_user_meta_data->>'role' = 'saas' or new.raw_user_meta_data->>'role' = 'affiliate')) then
    
    -- Insert into profiles
    insert into public.profiles (id, email, role, marketing_consent)
    values (
      new.id,
      new.email, -- email is likely present in auth.users
      new.raw_user_meta_data->>'role',
      coalesce((new.raw_user_meta_data->>'marketing_consent')::boolean, false)
    );

    -- Insert into specific role tables
    if (new.raw_user_meta_data->>'role' = 'affiliate') then
      insert into public.partners (profile_id)
      values (new.id);
    elsif (new.raw_user_meta_data->>'role' = 'saas') then
      insert into public.saas_companies (owner_id, name)
      values (new.id, 'My Company');
    end if;

  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on new user creation
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
